# Question Paper Intelligence

An intelligent platform for analyzing question papers — detecting repeated, paraphrased, and conceptually similar questions across exam papers using NLP, vector embeddings, and AI agents.

## Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | Next.js 14, React 18, TailwindCSS, TanStack Query   |
| Backend    | FastAPI, SQLAlchemy 2, Celery, Pydantic v2           |
| Database   | PostgreSQL 16 + pgvector                             |
| Cache/Queue| Redis 7                                              |
| Storage    | Local filesystem / MinIO / S3                        |
| AI/NLP     | Sentence Transformers, Google Gemini, BM25           |
| Infra      | Docker Compose                                       |

## Project Structure

```
question-paper-intelligence/
├── frontend/          # Next.js app (UI)
├── backend/           # FastAPI app (API + services)
│   ├── app/
│   │   ├── api/       # Route handlers
│   │   ├── core/      # Config, settings
│   │   ├── models/    # SQLAlchemy models
│   │   ├── services/  # Business logic
│   │   └── tasks/     # Celery async tasks
│   ├── tests/
│   └── requirements.txt
├── agents/            # AI/automation agents
├── docs/              # Product requirements
├── design/            # Design assets & wireframes
└── docker-compose.yml # Infrastructure services
```

## Prerequisites

- **Python** 3.11+
- **Node.js** 18+ and **npm**
- **Docker** and **Docker Compose**
- **Git**
- (Optional) **Tesseract OCR** — for scanned PDF extraction (`pytesseract`)
- (Optional) **Poppler** — required by `pdf2image` for PDF-to-image conversion

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/soumyajit-18-shipi-it/sop-website.git
cd sop-website
```

### 2. Start Infrastructure Services

Spin up PostgreSQL (with pgvector), Redis, and MinIO using Docker Compose:

```bash
docker compose up -d
```

This starts:
| Service    | Port(s)       | Credentials                       |
|------------|---------------|-----------------------------------|
| PostgreSQL | `5432`        | user: `qpi`, password: `secret`, db: `qpi_db` |
| Redis      | `6379`        | —                                 |
| MinIO      | `9000`, `9001`| user: `minioadmin`, password: `minioadminpassword` |

Verify services are running:

```bash
docker compose ps
```

### 3. Set Up the Backend

```bash
# Navigate to backend
cd backend

# Create and activate a virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Environment Variables

Create a `.env` file in the **project root** (or `backend/` directory):

```env
# Database
DATABASE_URL=postgresql+asyncpg://qpi:secret@localhost:5432/qpi_db
SYNC_DATABASE_URL=postgresql://qpi:secret@localhost:5432/qpi_db

# Redis & Celery
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# File Storage (local | minio | s3)
STORAGE_TYPE=local

# MinIO (if STORAGE_TYPE=minio)
S3_ENDPOINT_URL=http://localhost:9000
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadminpassword
S3_BUCKET_NAME=qpi-paper-uploads

# Similarity Thresholds
EXACT_MATCH_THRESHOLD=0.90
PARAPHRASE_MATCH_THRESHOLD=0.75
CONCEPTUAL_MATCH_THRESHOLD=0.60

# Embedding
EMBEDDING_PROVIDER=sentence_transformers
EMBEDDING_MODEL_NAME=all-mpnet-base-v2

# Security
JWT_SECRET_KEY=change-me-in-production

# Google Gemini (for AI agent features)
GEMINI_API_KEY=your-gemini-api-key
```

> **Note:** The `.env` file is git-ignored. Never commit secrets to the repository.

#### Run the Backend

```bash
# Start the FastAPI server (from the project root)
uvicorn backend.app.main:app --reload --port 8000
```

The API will be available at:
- **Docs:** http://localhost:8000/api/v1/docs
- **Health:** http://localhost:8000/health

#### Run Celery Worker (for async tasks)

In a separate terminal:

```bash
cd backend
celery -A app.tasks worker --loglevel=info
```

### 4. Set Up the Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will be available at **http://localhost:3000**.

### 5. Run Tests

```bash
# Backend tests
cd backend
pytest
```

## Development Workflow

1. **Infrastructure** — `docker compose up -d` to start PostgreSQL, Redis, MinIO.
2. **Backend** — activate venv, run `uvicorn` and `celery` worker.
3. **Frontend** — run `npm run dev`.
4. **Iterate** — the backend auto-reloads on file changes; Next.js has HMR.

## Configuration Reference

All backend settings are defined in [`backend/app/core/config.py`](backend/app/core/config.py) and can be overridden via environment variables or a `.env` file.

| Variable                    | Default                          | Description                        |
|-----------------------------|----------------------------------|------------------------------------|
| `DATABASE_URL`              | `postgresql+asyncpg://...`       | Async PostgreSQL connection string |
| `REDIS_URL`                 | `redis://localhost:6379/0`       | Redis connection URL               |
| `STORAGE_TYPE`              | `local`                          | File storage backend               |
| `EXACT_MATCH_THRESHOLD`     | `0.90`                           | Exact repetition similarity        |
| `PARAPHRASE_MATCH_THRESHOLD`| `0.75`                           | Paraphrase similarity              |
| `CONCEPTUAL_MATCH_THRESHOLD`| `0.60`                           | Conceptual similarity              |
| `EMBEDDING_PROVIDER`        | `sentence_transformers`          | Embedding engine                   |
| `GEMINI_API_KEY`            | —                                | Google Gemini API key              |

## License

This project is private.
