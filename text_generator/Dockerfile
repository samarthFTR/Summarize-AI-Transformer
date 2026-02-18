# ============================================
# Text Generator API — Dockerfile
# Fine-tuned GPT-2 model for text generation
# Models are downloaded from HuggingFace Hub
# ============================================

FROM python:3.11-slim

# Prevent Python from writing .pyc and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (CPU-only PyTorch to keep image small)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/
COPY api.py .

# Load model from HuggingFace Hub instead of local files
# The config reads this env var to know where to load from
ENV HF_MODEL_REPO=samarthftr/Text-generator

# Pre-download the model during build so startup is fast
RUN python -c "from transformers import GPT2Tokenizer, GPT2LMHeadModel; \
    GPT2Tokenizer.from_pretrained('samarthftr/Text-generator'); \
    GPT2LMHeadModel.from_pretrained('samarthftr/Text-generator'); \
    print('✅ Model pre-downloaded successfully')"

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/api/generate/health')" || exit 1

# Run the API
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8001"]
