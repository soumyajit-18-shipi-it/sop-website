import pytest
from fastapi.testclient import TestClient
from app.core.config import settings

# Force mock embedding provider for instant test execution
settings.EMBEDDING_PROVIDER = "mock"

from app.main import app

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "similarity_thresholds" in data

def test_paper_upload_and_status_contract():
    file_content = b"%PDF-1.4 Question Paper Mock Content for Physics 201\nQuestion 1. Define Newton's law. (5 marks)"
    
    response = client.post(
        "/api/v1/papers/upload",
        data={
            "course_id": "123e4567-e89b-12d3-a456-426614174000",
            "academic_year": "2025-2026",
            "term": "Fall",
            "exam_type": "Final",
            "total_marks": 100
        },
        files={"file": ("physics_draft.pdf", file_content, "application/pdf")}
    )
    
    assert response.status_code == 202
    res_data = response.json()
    assert "paper_id" in res_data
    assert "status" in res_data
    assert res_data["status"] == "COMPLETED"
    
    paper_id = res_data["paper_id"]
    status_resp = client.get(f"/api/v1/papers/{paper_id}/status")
    assert status_resp.status_code == 200
    status_data = status_resp.json()
    assert status_data["paper_id"] == paper_id
    assert status_data["status"] == "COMPLETED"
