import re
from typing import List, Dict, Any, Optional

class ParsedQuestion:
    def __init__(
        self,
        question_number: str,
        raw_text: str,
        clean_text: str,
        section_name: Optional[str] = None,
        parent_question_number: Optional[str] = None,
        marks: int = 0
    ):
        self.question_number = question_number
        self.raw_text = raw_text
        self.clean_text = clean_text
        self.section_name = section_name
        self.parent_question_number = parent_question_number
        self.marks = marks

    def to_dict(self) -> Dict[str, Any]:
        return {
            "question_number": self.question_number,
            "raw_text": self.raw_text,
            "clean_text": self.clean_text,
            "section_name": self.section_name,
            "parent_question_number": self.parent_question_number,
            "marks": self.marks,
        }

class DocumentParserService:
    @staticmethod
    def extract_text_from_pdf(file_bytes: bytes) -> tuple[str, bool]:
        """Extract text from PDF using PyMuPDF if available, or basic string decode."""
        try:
            import fitz
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            full_text = []
            for page in doc:
                full_text.append(page.get_text())
            text = "\n".join(full_text).strip()
            needs_ocr = len(text) < 50
            return text, needs_ocr
        except Exception:
            text = file_bytes.decode("utf-8", errors="ignore").strip()
            return text, len(text) < 50

    @staticmethod
    def extract_text_from_docx(file_bytes: bytes) -> str:
        try:
            import docx
            import io
            doc = docx.Document(io.BytesIO(file_bytes))
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            return "\n".join(paragraphs)
        except Exception:
            return file_bytes.decode("utf-8", errors="ignore").strip()

    @classmethod
    def parse_questions_from_text(cls, text: str) -> List[ParsedQuestion]:
        """Regex and heuristic layout parser for question segmentation."""
        lines = text.split("\n")
        questions: List[ParsedQuestion] = []
        
        current_section = "General"
        current_q_num = None
        current_q_lines = []
        current_marks = 0
        
        section_regex = re.compile(r"^(SECTION|PART)\s+([A-Z0-9]+)", re.IGNORECASE)
        question_regex = re.compile(r"^Q?(uestion)?\s*(\d+)[\.\:\)]\s*(.*)", re.IGNORECASE)
        subquestion_regex = re.compile(r"^\s*[\(\[]?([a-z0-9]+)[\)\.]\s*(.*)", re.IGNORECASE)
        marks_regex = re.compile(r"[\(\[](\d+)\s*(marks?|pts?|points?)[\)\]]", re.IGNORECASE)

        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue

            sec_match = section_regex.match(stripped)
            if sec_match:
                current_section = f"Section {sec_match.group(2)}"
                continue

            q_match = question_regex.match(stripped)
            if q_match:
                if current_q_num and current_q_lines:
                    full_q_text = " ".join(current_q_lines).strip()
                    questions.append(
                        ParsedQuestion(
                            question_number=str(current_q_num),
                            raw_text=full_q_text,
                            clean_text=cls._clean_text(full_q_text),
                            section_name=current_section,
                            marks=current_marks
                        )
                    )
                    current_q_lines = []
                    current_marks = 0
                
                current_q_num = q_match.group(2)
                rest_of_line = q_match.group(3)
                if rest_of_line:
                    current_q_lines.append(rest_of_line)
                
                m_match = marks_regex.search(stripped)
                if m_match:
                    current_marks = int(m_match.group(1))
                continue

            sub_match = subquestion_regex.match(stripped)
            if sub_match and current_q_num:
                sub_label = sub_match.group(1)
                sub_text = sub_match.group(2)
                sub_q_num = f"{current_q_num}({sub_label})"
                
                m_match = marks_regex.search(stripped)
                sub_marks = int(m_match.group(1)) if m_match else 0

                questions.append(
                    ParsedQuestion(
                        question_number=sub_q_num,
                        raw_text=sub_text or stripped,
                        clean_text=cls._clean_text(sub_text or stripped),
                        section_name=current_section,
                        parent_question_number=str(current_q_num),
                        marks=sub_marks
                    )
                )
                continue

            if current_q_num:
                current_q_lines.append(stripped)
                m_match = marks_regex.search(stripped)
                if m_match and current_marks == 0:
                    current_marks = int(m_match.group(1))

        if current_q_num and current_q_lines:
            full_q_text = " ".join(current_q_lines).strip()
            questions.append(
                ParsedQuestion(
                    question_number=str(current_q_num),
                    raw_text=full_q_text,
                    clean_text=cls._clean_text(full_q_text),
                    section_name=current_section,
                    marks=current_marks
                )
            )

        if not questions and len(text) > 5:
            questions.append(
                ParsedQuestion(
                    question_number="1",
                    raw_text=text,
                    clean_text=cls._clean_text(text),
                    section_name="General",
                    marks=100
                )
            )

        return questions

    @staticmethod
    def _clean_text(text: str) -> str:
        cleaned = re.sub(r"[\(\[]\d+\s*(marks?|pts?|points?)[\)\]]", "", text, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        return cleaned
