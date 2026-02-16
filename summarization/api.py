"""
FastAPI backend for Summarize AI Transformer.
Serves the fine-tuned T5 model for text summarization.
"""

import sys
import os
import time

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from transformers import T5Tokenizer, T5ForConditionalGeneration
from src.config import config

# --- App Setup ---
app = FastAPI(
    title="Summarize AI API",
    description="AI-powered text summarization using a fine-tuned T5 Transformer",
    version="1.0.0",
)

# CORS — allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Model State ---
tokenizer = None
model = None


@app.on_event("startup")
def load_model():
    """Load the model once at startup."""
    global tokenizer, model
    try:
        tokenizer = T5Tokenizer.from_pretrained(config.paths.model_dir)
        model = T5ForConditionalGeneration.from_pretrained(config.paths.model_dir)
        print("✅ Model loaded successfully.")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")


# --- Request / Response Schemas ---
class SummarizeRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Text to summarize")
    max_length: int = Field(default=128, ge=10, le=512, description="Max summary length")
    num_beams: int = Field(default=4, ge=1, le=10, description="Number of beams for beam search")


class SummarizeResponse(BaseModel):
    summary: str
    input_length: int
    output_length: int
    processing_time: float


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: str


# --- Endpoints ---
@app.get("/api/health", response_model=HealthResponse)
def health_check():
    """Check API and model status."""
    return HealthResponse(
        status="healthy",
        model_loaded=model is not None,
        model_name=config.model.model_name,
    )


@app.post("/api/summarize", response_model=SummarizeResponse)
def summarize(request: SummarizeRequest):
    """Generate a summary for the provided text."""
    if tokenizer is None or model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please try again later.")

    start_time = time.time()

    try:
        input_text = "summarize: " + request.text
        input_ids = tokenizer.encode(
            input_text,
            return_tensors="pt",
            max_length=config.model.max_input_length,
            truncation=True,
        )

        summary_ids = model.generate(
            input_ids,
            max_length=request.max_length,
            num_beams=request.num_beams,
            early_stopping=config.model.early_stopping,
        )

        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        processing_time = round(time.time() - start_time, 3)

        return SummarizeResponse(
            summary=summary,
            input_length=len(request.text.split()),
            output_length=len(summary.split()),
            processing_time=processing_time,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
