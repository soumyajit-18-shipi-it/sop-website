import pytest
from app.services.similarity_engine import HybridSimilarityEngine
from app.models.entities import MatchTier

def test_similarity_engine_classification():
    engine = HybridSimilarityEngine(
        exact_threshold=0.90,
        paraphrase_threshold=0.75,
        conceptual_threshold=0.60
    )
    
    draft_text = "Calculate the trajectory of a projectile launched at 45 degrees."
    draft_vec = [1.0] * 768
    
    historical_qs = [
        {
            "id": "hist_1",
            "clean_text": "Calculate the trajectory of a projectile launched at 45 degrees.",
            "embedding": [1.0] * 768
        },
        {
            "id": "hist_2",
            "clean_text": "Derive the motion equation of a projectile.",
            "embedding": [0.7] + [0.1] * 767
        }
    ]
    
    matches = engine.find_matches_for_question(draft_text, draft_vec, historical_qs)
    assert len(matches) > 0
    assert matches[0].historical_question_id == "hist_1"
    assert matches[0].match_tier == MatchTier.EXACT
    assert matches[0].composite_score >= 0.90
