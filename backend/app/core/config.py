import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "Question Paper Intelligence API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://qpi:secret@localhost:5432/qpi_db",
        description="Async PostgreSQL connection string"
    )
    SYNC_DATABASE_URL: str = Field(
        default="postgresql://qpi:secret@localhost:5432/qpi_db",
        description="Sync PostgreSQL connection string for Celery/Alembic"
    )
    
    # Redis & Celery
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # File Storage
    STORAGE_TYPE: str = Field(default="local", description="local, s3, or minio")
    LOCAL_STORAGE_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
    S3_BUCKET_NAME: str = "qpi-paper-uploads"
    S3_ENDPOINT_URL: str | None = None
    AWS_ACCESS_KEY_ID: str | None = None
    AWS_SECRET_ACCESS_KEY: str | None = None
    AWS_REGION: str = "us-east-1"
    
    # Configurable Similarity Thresholds (Requirement: Must be configurable)
    EXACT_MATCH_THRESHOLD: float = Field(default=0.90, description="Threshold for Exact Repetition")
    PARAPHRASE_MATCH_THRESHOLD: float = Field(default=0.75, description="Threshold for Paraphrased Repetition")
    CONCEPTUAL_MATCH_THRESHOLD: float = Field(default=0.60, description="Threshold for Conceptual Repetition")
    
    # Embedding Configuration (Pluggable Abstraction)
    EMBEDDING_PROVIDER: str = Field(default="sentence_transformers", description="sentence_transformers or mock")
    EMBEDDING_MODEL_NAME: str = "all-mpnet-base-v2"
    EMBEDDING_DIMENSION: int = 768
    
    # Security
    JWT_SECRET_KEY: str = "SUPER_SECRET_KEY_CHANGE_IN_PRODUCTION_QPI_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Google ADK Gemini Key
    GEMINI_API_KEY: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
