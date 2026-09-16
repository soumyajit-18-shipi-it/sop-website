import logging
import io
from app.core.celery_app import celery_app
from app.services.document_parser import DocumentParserService
from app.services.ocr_service import OCRService
from app.services.embedding_provider import get_embedding_provider
from app.services.similarity_engine import HybridSimilarityEngine
from app.services.storage_service import get_storage_provider

logger = logging.getLogger("qpi.tasks")

@celery_app.task(name="process_paper_task")
def process_paper_task(paper_id: str, file_path: str, mime_type: str):
    logger.info(f"Starting async processing for paper_id={paper_id}")
    try:
        storage = get_storage_provider()
        file_bytes = storage.get_file(file_path)
        
        # 1. Text Extraction
        if "pdf" in mime_type.lower():
            text, needs_ocr = DocumentParserService.extract_text_from_pdf(file_bytes)
            if needs_ocr:
                text = OCRService.extract_text_with_ocr(file_bytes)
        elif "word" in mime_type.lower() or "docx" in mime_type.lower():
            text = DocumentParserService.extract_text_from_docx(file_bytes)
        else:
            text = file_bytes.decode("utf-8", errors="ignore")

        # 2. Question Parsing
        parsed_questions = DocumentParserService.parse_questions_from_text(text)
        logger.info(f"Extracted {len(parsed_questions)} questions for paper_id={paper_id}")

        # 3. Vector Embedding Generation
        embedding_provider = get_embedding_provider()
        clean_texts = [q.clean_text for q in parsed_questions]
        embeddings = embedding_provider.generate_embeddings_batch(clean_texts)

        logger.info(f"Paper processing completed successfully for paper_id={paper_id}")
        return {
            "status": "COMPLETED",
            "paper_id": paper_id,
            "question_count": len(parsed_questions),
            "questions": [q.to_dict() for q in parsed_questions]
        }
    except Exception as e:
        logger.error(f"Paper processing failed for paper_id={paper_id}: {e}", exc_info=True)
        return {
            "status": "FAILED",
            "paper_id": paper_id,
            "error": str(e)
        }
