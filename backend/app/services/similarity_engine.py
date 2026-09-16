import math
from typing import List, Dict, Any, Tuple
import numpy as np
from app.core.config import settings
from app.models.entities import MatchTier

class SimilarityResult:
    def __init__(
        self,
        historical_question_id: str,
        semantic_score: float,
        lexical_score: float,
        composite_score: float,
        match_tier: MatchTier
    ):
        self.historical_question_id = historical_question_id
        self.semantic_score = round(semantic_score, 4)
        self.lexical_score = round(lexical_score, 4)
        self.composite_score = round(composite_score, 4)
        self.match_tier = match_tier

class HybridSimilarityEngine:
    """Deterministic hybrid similarity search engine combining vector cosine distance and BM25/Jaccard lexical scores."""
    
    def __init__(
        self,
        exact_threshold: float = settings.EXACT_MATCH_THRESHOLD,
        paraphrase_threshold: float = settings.PARAPHRASE_MATCH_THRESHOLD,
        conceptual_threshold: float = settings.CONCEPTUAL_MATCH_THRESHOLD,
        alpha: float = 0.70
    ):
        self.exact_threshold = exact_threshold
        self.paraphrase_threshold = paraphrase_threshold
        self.conceptual_threshold = conceptual_threshold
        self.alpha = alpha

    @staticmethod
    def compute_cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        v1 = np.array(vec1, dtype=np.float32)
        v2 = np.array(vec2, dtype=np.float32)
        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return float(np.dot(v1, v2) / (norm1 * norm2))

    @staticmethod
    def compute_jaccard_similarity(text1: str, text2: str) -> float:
        set1 = set(text1.lower().split())
        set2 = set(text2.lower().split())
        if not set1 or not set2:
            return 0.0
        intersection = set1.intersection(set2)
        union = set1.union(set2)
        return len(intersection) / len(union)

    def find_matches_for_question(
        self,
        draft_text: str,
        draft_embedding: List[float],
        historical_questions: List[Dict[str, Any]]
    ) -> List[SimilarityResult]:
        if not historical_questions:
            return []

        # Try rank_bm25, fallback to Jaccard
        try:
            from rank_bm25 import BM25Okapi
            tokenized_corpus = [q["clean_text"].lower().split() for q in historical_questions]
            bm25 = BM25Okapi(tokenized_corpus)
            tokenized_query = draft_text.lower().split()
            raw_bm25_scores = bm25.get_scores(tokenized_query)
            max_bm25 = max(raw_bm25_scores) if len(raw_bm25_scores) > 0 and max(raw_bm25_scores) > 0 else 1.0
            normalized_lexical = [score / max_bm25 for score in raw_bm25_scores]
        except ImportError:
            normalized_lexical = [self.compute_jaccard_similarity(draft_text, q["clean_text"]) for q in historical_questions]

        results = []
        for i, h_q in enumerate(historical_questions):
            h_vec = h_q.get("embedding")
            if h_vec:
                sem_score = self.compute_cosine_similarity(draft_embedding, h_vec)
            else:
                sem_score = 0.0

            lex_score = normalized_lexical[i]
            comp_score = (self.alpha * sem_score) + ((1 - self.alpha) * lex_score)

            tier = None
            if comp_score >= self.exact_threshold:
                tier = MatchTier.EXACT
            elif comp_score >= self.paraphrase_threshold:
                tier = MatchTier.PARAPHRASED
            elif comp_score >= self.conceptual_threshold:
                tier = MatchTier.CONCEPTUAL

            if tier:
                results.append(
                    SimilarityResult(
                        historical_question_id=str(h_q["id"]),
                        semantic_score=sem_score,
                        lexical_score=lex_score,
                        composite_score=comp_score,
                        match_tier=tier
                    )
                )

        results.sort(key=lambda r: r.composite_score, reverse=True)
        return results
