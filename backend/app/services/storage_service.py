from abc import ABC, abstractmethod
import os
import shutil
from typing import BinaryIO
from app.core.config import settings

class BaseStorageProvider(ABC):
    @abstractmethod
    def save_file(self, file_obj: BinaryIO, relative_path: str) -> str:
        """Save a file and return its stored URI/path."""
        pass

    @abstractmethod
    def get_file(self, relative_path: str) -> bytes:
        """Retrieve a file's bytes."""
        pass

class LocalStorageProvider(BaseStorageProvider):
    def __init__(self, base_dir: str = settings.LOCAL_STORAGE_DIR):
        self.base_dir = base_dir
        os.makedirs(self.base_dir, exist_ok=True)

    def save_file(self, file_obj: BinaryIO, relative_path: str) -> str:
        full_path = os.path.join(self.base_dir, relative_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        file_obj.seek(0)
        with open(full_path, "wb") as f:
            shutil.copyfileobj(file_obj, f)
        return full_path

    def get_file(self, relative_path: str) -> bytes:
        full_path = os.path.join(self.base_dir, relative_path)
        if not os.path.exists(full_path):
            raise FileNotFoundError(f"File not found: {full_path}")
        with open(full_path, "rb") as f:
            return f.read()

def get_storage_provider() -> BaseStorageProvider:
    if settings.STORAGE_TYPE == "local":
        return LocalStorageProvider()
    # Default fallback to local storage
    return LocalStorageProvider()
