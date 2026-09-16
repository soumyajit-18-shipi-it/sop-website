import pytest
import io
import tempfile
from app.services.storage_service import LocalStorageProvider
from app.core.security import create_access_token, decode_access_token

def test_local_storage_provider():
    with tempfile.TemporaryDirectory() as tmp_dir:
        provider = LocalStorageProvider(base_dir=tmp_dir)
        file_data = io.BytesIO(b"Physics Exam Draft 2026")
        saved_path = provider.save_file(file_data, "physics/paper.pdf")
        
        assert saved_path.endswith("paper.pdf")
        content = provider.get_file("physics/paper.pdf")
        assert content == b"Physics Exam Draft 2026"

def test_jwt_token_creation_and_decoding():
    token = create_access_token({"sub": "user_123", "email": "faculty@univ.edu"})
    decoded = decode_access_token(token)
    assert decoded["sub"] == "user_123"
    assert decoded["email"] == "faculty@univ.edu"
