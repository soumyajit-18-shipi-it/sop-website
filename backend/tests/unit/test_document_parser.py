import pytest
from app.services.document_parser import DocumentParserService

SAMPLE_PAPER_TEXT = """
SECTION A: MECHANICS

1. Define Newton's First Law of Motion and give a real-world example. (5 marks)

2. A 5kg block is pushed across a frictionless surface with a force of 20N. Calculate acceleration. (10 marks)

3. Explain elastic collisions. (5 marks)

(a) Derive kinetic energy conservation equation. (5 marks)
(b) Calculate velocity after collision. (5 marks)

SECTION B: THERMODYNAMICS

4. State the Second Law of Thermodynamics. (10 marks)
"""

def test_document_parser_regex():
    questions = DocumentParserService.parse_questions_from_text(SAMPLE_PAPER_TEXT)
    assert len(questions) >= 4
    
    q1 = next(q for q in questions if q.question_number == "1")
    assert q1.section_name == "Section A"
    assert "Newton's First Law" in q1.raw_text
    assert q1.marks == 5
    
    q2 = next(q for q in questions if q.question_number == "2")
    assert q2.marks == 10
    
    q3a = next((q for q in questions if "3(a)" in q.question_number or q.question_number == "3a"), None)
    if q3a:
        assert q3a.parent_question_number == "3"
