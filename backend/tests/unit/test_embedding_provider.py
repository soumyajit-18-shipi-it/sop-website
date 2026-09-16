import pytest
from app.services.embedding_provider import MockEmbeddingProvider

def test_mock_embedding_provider():
    provider = MockEmbeddingProvider(dim=768)
    assert provider.dimension == 768
    
    vec1 = provider.generate_embedding("Calculate the trajectory of a projectile.")
    assert len(vec1) == 768
    
    # Determinism check
    vec2 = provider.generate_embedding("Calculate the trajectory of a projectile.")
    assert vec1 == vec2
    
    # Batch embedding check
    batch_vecs = provider.generate_embeddings_batch(["Q1 text", "Q2 text"])
    assert len(batch_vecs) == 2
    assert len(batch_vecs[0]) == 768
