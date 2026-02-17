"""
FastAPI backend for Text Generator (GPT-2).
Serves the fine-tuned GPT-2 model for text generation from summaries.
"""

import sys
import os
import time

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from src.config import config
from src.inference.generate import load_model, generate_text

# --- App Setup ---
app = FastAPI(
    title="Text Generator API",
    description="AI-powered text generation using a fine-tuned GPT-2 model",
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
def startup_load_model():
    """Load the model once at startup."""
    global tokenizer, model
    try:
        tokenizer, model = load_model()
        print("✅ GPT-2 Text Generator model loaded successfully.")
    except Exception as e:
        print(f"❌ Failed to load GPT-2 model: {e}")


# --- Request / Response Schemas ---
class GenerateRequest(BaseModel):
    summary: str = Field(..., min_length=5, description="Summary/prompt to expand into full text")
    max_length: int = Field(default=200, ge=50, le=512, description="Max tokens to generate")
    temperature: float = Field(default=0.7, ge=0.1, le=2.0, description="Sampling temperature")
    top_k: int = Field(default=40, ge=1, le=100, description="Top-K filtering")
    top_p: float = Field(default=0.90, ge=0.1, le=1.0, description="Nucleus sampling probability")


class GenerateResponse(BaseModel):
    generated_text: str
    input_length: int
    output_length: int
    processing_time: float


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: str


# --- Endpoints ---
@app.get("/api/generate/health", response_model=HealthResponse)
def health_check():
    """Check API and model status."""
    return HealthResponse(
        status="healthy",
        model_loaded=model is not None,
        model_name="gpt2-finetuned",
    )


@app.post("/api/generate", response_model=GenerateResponse)
def generate(request: GenerateRequest):
    """Generate expanded text from a summary."""
    if tokenizer is None or model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please try again later.")

    start_time = time.time()

    try:
        generated = generate_text(
            summary=request.summary,
            tokenizer=tokenizer,
            model=model,
            max_length=request.max_length,
            temperature=request.temperature,
            top_k=request.top_k,
            top_p=request.top_p,
        )

        processing_time = round(time.time() - start_time, 3)

        return GenerateResponse(
            generated_text=generated,
            input_length=len(request.summary.split()),
            output_length=len(generated.split()),
            processing_time=processing_time,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text generation failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8001, reload=True)
