import uuid
from datetime import datetime
from typing import Optional, List
from enum import Enum
from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, ForeignKey, Numeric, Table, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class UserRole(str, Enum):
    FACULTY = "FACULTY"
    DEPT_HEAD = "DEPT_HEAD"
    ARCHIVAL_ADMIN = "ARCHIVAL_ADMIN"
    SYSTEM_ADMIN = "SYSTEM_ADMIN"

class PaperStatus(str, Enum):
    QUEUED = "QUEUED"
    PARSING = "PARSING"
    EMBEDDING = "EMBEDDING"
    MATCHING = "MATCHING"
    COMPLETED = "COMPLETED"
    APPROVED = "APPROVED"
    FAILED = "FAILED"

class QuestionType(str, Enum):
    MCQ = "MCQ"
    SHORT_ANSWER = "SHORT_ANSWER"
    LONG_ESSAY = "LONG_ESSAY"
    NUMERICAL = "NUMERICAL"
    DERIVATION = "DERIVATION"

class BloomsLevel(str, Enum):
    REMEMBER = "REMEMBER"
    UNDERSTAND = "UNDERSTAND"
    APPLY = "APPLY"
    ANALYZE = "ANALYZE"
    EVALUATE = "EVALUATE"
    CREATE = "CREATE"

class MatchTier(str, Enum):
    EXACT = "EXACT"
    PARAPHRASED = "PARAPHRASED"
    CONCEPTUAL = "CONCEPTUAL"

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    users = relationship("User", back_populates="department")
    courses = relationship("Course", back_populates="department")

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.FACULTY)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    mfa_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    department = relationship("Department", back_populates="users")
    drafts = relationship("QuestionPaperDraft", back_populates="uploader")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="CASCADE"), nullable=False)
    code = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    academic_year = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    department = relationship("Department", back_populates="courses")
    syllabus_units = relationship("SyllabusUnit", back_populates="course", cascade="all, delete-orphan")
    drafts = relationship("QuestionPaperDraft", back_populates="course")

class SyllabusUnit(Base):
    __tablename__ = "syllabus_units"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    unit_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    target_weightage_percent = Column(Numeric(5, 2), nullable=False)
    keywords = Column(JSONB, default=list)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    course = relationship("Course", back_populates="syllabus_units")
    questions = relationship("Question", back_populates="unit")

class QuestionPaperDraft(Base):
    __tablename__ = "question_paper_drafts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    uploader_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="RESTRICT"), nullable=False)
    academic_year = Column(String(20), nullable=False)
    term = Column(String(50), nullable=False)
    exam_type = Column(String(50), nullable=False)
    total_marks = Column(Integer, nullable=False)
    file_path = Column(String(512), nullable=False)
    file_mime_type = Column(String(100), nullable=False)
    file_hash = Column(String(64), nullable=False)
    is_historical_archive = Column(Boolean, default=False)
    status = Column(SQLEnum(PaperStatus), nullable=False, default=PaperStatus.QUEUED)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    uploader = relationship("User", back_populates="drafts")
    course = relationship("Course", back_populates="drafts")
    questions = relationship("Question", back_populates="paper", cascade="all, delete-orphan")
    report = relationship("QPIReport", back_populates="paper", uselist=False, cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    paper_id = Column(UUID(as_uuid=True), ForeignKey("question_paper_drafts.id", ondelete="CASCADE"), nullable=False)
    section_name = Column(String(100), nullable=True)
    question_number = Column(String(20), nullable=False)
    parent_question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id", ondelete="CASCADE"), nullable=True)
    raw_text = Column(Text, nullable=False)
    clean_text = Column(Text, nullable=False)
    marks = Column(Integer, default=0)
    question_type = Column(SQLEnum(QuestionType), nullable=True)
    blooms_level = Column(SQLEnum(BloomsLevel), nullable=True)
    unit_id = Column(UUID(as_uuid=True), ForeignKey("syllabus_units.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    paper = relationship("QuestionPaperDraft", back_populates="questions")
    unit = relationship("SyllabusUnit", back_populates="questions")

class SimilarityMatch(Base):
    __tablename__ = "similarity_matches"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    draft_question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    historical_question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    semantic_score = Column(Numeric(5, 4), nullable=False)
    lexical_score = Column(Numeric(5, 4), nullable=False)
    composite_score = Column(Numeric(5, 4), nullable=False)
    match_tier = Column(SQLEnum(MatchTier), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class QPIReport(Base):
    __tablename__ = "qpi_reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    paper_id = Column(UUID(as_uuid=True), ForeignKey("question_paper_drafts.id", ondelete="CASCADE"), unique=True, nullable=False)
    originality_score = Column(Numeric(5, 2), nullable=False)
    total_questions = Column(Integer, nullable=False)
    matched_questions_count = Column(Integer, nullable=False)
    unit_coverage_json = Column(JSONB, nullable=False, default=dict)
    blooms_distribution_json = Column(JSONB, nullable=False, default=dict)
    question_type_json = Column(JSONB, nullable=False, default=dict)
    overused_topics_json = Column(JSONB, nullable=False, default=dict)
    generated_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    paper = relationship("QuestionPaperDraft", back_populates="report")
    recommendations = relationship("NextPaperRecommendation", back_populates="report", cascade="all, delete-orphan")

class NextPaperRecommendation(Base):
    __tablename__ = "next_paper_recommendations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("qpi_reports.id", ondelete="CASCADE"), nullable=False)
    priority = Column(Integer, nullable=False)
    category = Column(String(50), nullable=False)
    target_question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id", ondelete="SET NULL"), nullable=True)
    action_text = Column(Text, nullable=False)
    rationale = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    report = relationship("QPIReport", back_populates="recommendations")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False)
    resource_id = Column(UUID(as_uuid=True), nullable=False)
    details = Column(JSONB, default=dict)
    ip_hash = Column(String(64), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
