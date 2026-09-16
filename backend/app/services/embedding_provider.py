from abc import ABC, abstractmethod
from typing import List
import numpy as np
from app.core.config import settings

class BaseEmbeddingProvider(ABC):
    @abstractmethod
    def generate_embedding(self, text: str) -> List[float]:
        """Generate a dense vector embedding for a single string."""
        pass

    @abstractmethod
    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate dense vector embeddings for a batch of strings."""
        pass

    @property
    @abstractmethod
    def dimension(self) -> int:
        """Return the vector dimensionality."""
        pass

class MockEmbeddingProvider(BaseEmbeddingProvider):
    """Deterministic mock embedding provider for fast testing without GPU/PyTorch overhead."""
    def __init__(self, dim: int = settings.EMBEDDING_DIMENSION):
        self._dim = dim

    def generate_embedding(self, text: str) -> List[float]:
        # Hash string deterministically to produce a unit normalized vector
        np.random.seed(hash(text) % (2**32))
        vec = np.random.randn(self._dim)
        norm = np.linalg.norm(vec)
        if norm == 0:
            return vec.tolist()
        return (vec / norm).tolist()

    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        return [self.generate_embedding(t) for t in texts]

    @property
    def dimension(self) -> int:
        return self._dim

class SentenceTransformersProvider(BaseEmbeddingProvider):
    """Production embedding provider using sentence-transformers."""
    def __init__(self, model_name: str = settings.EMBEDDING_MODEL_NAME):
        self.model_name = model_name
        self._model = None

    def _get_model(self):
        if self._model is None:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(self.model_name)
        return self._model

    def generate_embedding(self, text: str) -> List[float]:
        model = self._get_model()
        embedding = model.encode(text, convert_to_numpy=True)
        return embedding.tolist()

    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        model = self._get_model()
        embeddings = model.encode(texts, convert_to_numpy=True)
        return embeddings.tolist()

    @property
    def dimension(self) -> int:
        return settings.EMBEDDING_DIMENSION

def get_embedding_provider() -> BaseEmbeddingProvider:
    if settings.EMBEDDING_PROVIDER == "mock":
        return MockEmbeddingProvider()
    try:
        return SentenceTransformersProvider()
    except Exception:
        # Fallback gracefully to mock if sentence-transformers weights are missing in dev
        return MockEmbeddingProvider()
