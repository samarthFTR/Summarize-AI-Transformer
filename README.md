# GenSumm-AI Transformer

![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95%2B-009688)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)
![HuggingFace](https://img.shields.io/badge/🤗%20HuggingFace-Models-yellow)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)

**GenSumm-AI Transformer** is a comprehensive, full-stack AI toolkit featuring two Transformer-based models — **T5-small** for text summarization and **GPT-2** for text generation. It provides a complete pipeline from training to production deployment.

This project offers: data preprocessing, fine-tuning, inference via **FastAPI** backends, a modern **Next.js** frontend, and full **Docker** containerization with deployment support for **Render** and **Vercel**.

## 🚀 Key Features

*   **Dual Transformer Architecture**:
    *   **T5 (Text-to-Text Transfer Transformer)** — fine-tuned for abstractive text summarization
    *   **GPT-2** — fine-tuned for text generation from summaries
*   **Modular Training Pipelines**: Clean separation of concerns for data loading, training, evaluation, and inference.
*   **Full-Stack Application**:
    *   **Backend**: Two high-performance APIs built with **FastAPI** (port 8000 & 8001)
    *   **Frontend**: Sleek, monochrome UI built with **Next.js 16** and **React 19**
    *   **Demo**: Interactive **Streamlit** dashboard for quick testing
*   **Production-Ready Deployment**:
    *   🐳 **Docker** + **Docker Compose** for containerized deployment
    *   ☁️ **Render** for API hosting (with Blueprint auto-deploy)
    *   ▲ **Vercel** for frontend hosting
    *   🤗 **HuggingFace Hub** for model weight storage
*   **Configurable**: Centralized configuration management via `src/config.py` in each service
*   **Evaluation Metrics**: Integrated **ROUGE** score calculation for quality assessment
*   **GPU Acceleration**: Optimized for CUDA-enabled environments for faster training

## 🤗 Pre-trained Models

Fine-tuned model weights are hosted on HuggingFace Hub:

| Model | HuggingFace Repo | Size | Task |
| :--- | :--- | :--- | :--- |
| T5-small | [samarthftr/summarizer](https://huggingface.co/samarthftr/summarizer) | 242 MB | Text Summarization |
| GPT-2 | [samarthftr/Text-generator](https://huggingface.co/samarthftr/Text-generator) | 498 MB | Text Generation |

## 🛠️ Installation

### Prerequisites
*   Python 3.8+
*   Node.js 18+ (for frontend)
*   Docker (optional, for containerized deployment)

### 1. Clone & Setup

```bash
git clone https://github.com/samarthFTR/Summarize-AI-Transformer.git
cd Summarize-AI-Transformer
```

### 2. Backend Setup (Python APIs)

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup (Next.js)

```bash
cd frontend
npm install
```

## 🏃 Usage

### 1. Training the Models

**Summarization (T5):**
```bash
cd summarization
python run.py
```

**Text Generator (GPT-2):**
```bash
cd text_generator
python run.py
```

### 2. Starting the Backend APIs

**Summarization API (port 8000):**
```bash
cd summarization
python api.py
```
*   📄 API Docs: `http://localhost:8000/docs`
*   ❤️ Health Check: `http://localhost:8000/api/health`

**Text Generator API (port 8001):**
```bash
cd text_generator
python api.py
```
*   📄 API Docs: `http://localhost:8001/docs`
*   ❤️ Health Check: `http://localhost:8001/api/generate/health`

### 3. Running the Frontend

```bash
cd frontend
npm run dev
```
*Access the application at `http://localhost:3000`.*

### 4. Running the Streamlit Demo

```bash
cd summarization
streamlit run app.py
```

## 🐳 Docker Deployment

Run the entire stack with Docker Compose:

```bash
# Build and start all services
docker compose up --build

# Services will be available at:
# Frontend:           http://localhost:3000
# Summarization API:  http://localhost:8000
# Text Generator API: http://localhost:8001
```

Models are automatically downloaded from HuggingFace Hub during the Docker build.

## ☁️ Cloud Deployment

### APIs → Render

1.  Push code to GitHub
2.  Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3.  Connect your GitHub repo — Render auto-detects `render.yaml`
4.  Click **Apply** to deploy both API services

### Frontend → Vercel

1.  Go to [Vercel](https://vercel.com) → **Add New Project** → Import repo
2.  Set **Root Directory** to `frontend`
3.  Add **Environment Variables**:
    ```
    NEXT_PUBLIC_API_URL=https://your-summarization-api.onrender.com
    NEXT_PUBLIC_GENERATOR_API_URL=https://your-generator-api.onrender.com
    ```
4.  Click **Deploy**

## 📊 Data Preparation

The training pipelines require a CSV file with the following columns:

| Column Name | Description |
| :--- | :--- |
| `Text` | The full text article or document to be summarized. |
| `Summary` | The ground truth summary. |

*Configure input paths and column mapping in each service's `src/config.py`.*

## 📂 Project Structure

```plaintext
Summarize-AI-Transformer/
├── summarization/           # T5 Summarization Service
│   ├── api.py               # FastAPI backend (port 8000)
│   ├── app.py               # Streamlit demo
│   ├── run.py               # Training entry point
│   ├── Dockerfile           # Docker image definition
│   ├── requirements.txt     # Python dependencies
│   ├── src/
│   │   ├── config.py        # Service configuration
│   │   ├── data/            # Data loading & preprocessing
│   │   ├── training/        # Training loop & utilities
│   │   ├── inference/       # Inference logic
│   │   └── evaluation/      # ROUGE metric calculation
│   └── models/              # Saved model checkpoints (gitignored)
│
├── text_generator/          # GPT-2 Text Generation Service
│   ├── api.py               # FastAPI backend (port 8001)
│   ├── run.py               # Training entry point
│   ├── Dockerfile           # Docker image definition
│   ├── requirements.txt     # Python dependencies
│   ├── src/
│   │   ├── config.py        # Service configuration
│   │   ├── data/            # Data loading & preprocessing
│   │   ├── training/        # Training loop
│   │   └── inference/       # Text generation logic
│   └── models/              # Saved model checkpoints (gitignored)
│
├── frontend/                # Next.js 16 Frontend
│   ├── src/                 # React components & pages
│   ├── public/              # Static assets
│   ├── Dockerfile           # Multi-stage Docker build
│   └── package.json         # Node.js dependencies
│
├── docker-compose.yml       # Orchestrate all 3 services
├── render.yaml              # Render Blueprint (auto-deploy)
├── upload_models.py         # Upload models to HuggingFace Hub
├── requirements.txt         # Root Python dependencies (training)
└── README.md
```

## 🚧 Status & Roadmap

*   ✅ **Summarization Pipeline**: T5-small fine-tuning complete
*   ✅ **Text Generation Pipeline**: GPT-2 fine-tuning complete
*   ✅ **Backend APIs**: Dual FastAPI services
*   ✅ **Frontend**: Modern Next.js 16 UI with React 19
*   ✅ **Docker**: Full containerization with Docker Compose
*   ✅ **HuggingFace Hub**: Model weights hosted and versioned
*   ✅ **Cloud Deployment**: Render + Vercel configurations ready
*   🚧 **Advanced Metrics**: Additional evaluation metrics planned

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
