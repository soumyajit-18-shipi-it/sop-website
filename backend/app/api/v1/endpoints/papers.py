import uuid
import hashlib
from typing import Optional, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, status
from app.core.config import settings
from app.core.security import get_current_user, CurrentUser
from app.services.storage_service import get_storage_provider
from app.services.document_parser import DocumentParserService
from app.services.embedding_provider import get_embedding_provider
from app.services.similarity_engine import HybridSimilarityEngine
from app.models.entities import PaperStatus

router = APIRouter()

# In-Memory status store for fast dev/MVP demonstration without DB locking
MOCK_PAPER_JOBS: Dict[str, Dict[str, Any]] = {}

@router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_paper(
    file: UploadFile = File(...),
    course_id: str = Form(...),
    academic_year: str = Form(...),
    term: str = Form(...),
    exam_type: str = Form(...),
    total_marks: int = Form(100),
    current_user: CurrentUser = Depends(get_current_user),
):
    # 1. Client-side file validation (Max 25MB)
    MAX_FILE_SIZE = 25 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowed limit of 25MB."
        )

    # 2. File hashing and storage
    file_hash = hashlib.sha256(content).hexdigest()
    paper_id = str(uuid.uuid4())
    filename = file.filename or f"paper_{paper_id}.pdf"
    rel_path = f"{course_id}/{paper_id}_{filename}"

    storage = get_storage_provider()
    import io
    storage.save_file(io.BytesIO(content), rel_path)

    # 3. Synchronous parsing & vector processing for MVP instant feedback
    mime = file.content_type or "application/pdf"
    if "pdf" in mime.lower():
        text, needs_ocr = DocumentParserService.extract_text_from_pdf(content)
    elif "docx" in mime.lower():
        text = DocumentParserService.extract_text_from_docx(content)
    else:
        text = content.decode("utf-8", errors="ignore")

    questions = DocumentParserService.parse_questions_from_text(text)
    
    # Embedding generation
    emb_provider = get_embedding_provider()
    clean_texts = [q.clean_text for q in questions]
    embeddings = emb_provider.generate_embeddings_batch(clean_texts)

    # Sample historical comparison pool
    sample_historical_qs = [
        {
            "id": "hist_2021_q4",
            "clean_text": "Calculate the trajectory of a projectile launched at 45 degrees.",
            "embedding": emb_provider.generate_embedding("Calculate the trajectory of a projectile launched at 45 degrees.")
        },
        {
            "id": "hist_2019_q12",
            "clean_text": "Explain principles of quantum entanglement and computing.",
            "embedding": emb_provider.generate_embedding("Explain principles of quantum entanglement and computing.")
        }
    ]

    # Perform hybrid similarity matching
    sim_engine = HybridSimilarityEngine()
    matches = []
    for i, q in enumerate(questions):
        q_emb = embeddings[i] if i < len(embeddings) else [0.0]*768
        m_list = sim_engine.find_matches_for_question(q.clean_text, q_emb, sample_historical_qs)
        if m_list:
            matches.append({
                "question_number": q.question_number,
                "text": q.raw_text,
                "top_match": {
                    "matched_id": m_list[0].historical_question_id,
                    "composite_score": m_list[0].composite_score,
                    "tier": m_list[0].match_tier.value
                }
            })

    report_id = str(uuid.uuid4())
    # Calculate paper originality score
    exact_count = sum(1 for m in matches if m["top_match"]["tier"] == "EXACT")
    orig_score = round(max(0.0, 100.0 - (exact_count * 8.5)), 1)

    MOCK_PAPER_JOBS[paper_id] = {
        "paper_id": paper_id,
        "status": PaperStatus.COMPLETED,
        "progress_percent": 100,
        "current_step": "Analysis complete",
        "report_id": report_id,
        "filename": filename,
        "question_count": len(questions),
        "originality_score": orig_score,
        "matches": matches,
        "course_id": course_id,
        "academic_year": academic_year,
        "term": term,
        "exam_type": exam_type
    }

    return {
        "paper_id": paper_id,
        "status": PaperStatus.COMPLETED.value,
        "status_url": f"{settings.API_V1_STR}/papers/{paper_id}/status",
        "report_id": report_id
    }

@router.get("/{id}/status")
async def get_paper_status(id: str):
    if id in MOCK_PAPER_JOBS:
        return MOCK_PAPER_JOBS[id]
    return {
        "paper_id": id,
        "status": PaperStatus.COMPLETED.value,
        "progress_percent": 100,
        "current_step": "Analysis complete",
        "report_id": str(uuid.uuid4())
    }

@router.get("/{id}/summary")
async def get_paper_summary(id: str):
    if id in MOCK_PAPER_JOBS:
        return MOCK_PAPER_JOBS[id]
    raise HTTPException(status_code=404, detail="Paper not found")
