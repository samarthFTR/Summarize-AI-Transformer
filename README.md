<p align="center">
  <h1 align="center">GenSumm-AI Transformer</h1>
  <p align="center">
    <strong>Summarize &amp; Generate Text with Dual Transformer Models</strong>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/🤗_HuggingFace-FFD21E?style=for-the-badge" alt="HuggingFace">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

---

**GenSumm-AI Transformer** is a production-ready, full-stack AI application that pairs two fine-tuned Transformer models — **T5-small** for abstractive text summarization and **GPT-2** for text generation. It delivers an end-to-end pipeline from data preprocessing and model training to inference, containerization, and cloud deployment.

> **Live Demo →** Frontend on [Vercel](https://vercel.com) · APIs on [Render](https://render.com) · Models on [HuggingFace Hub](https://huggingface.co/samarthftr)

---

## ✨ Key Features

| Category | Details |
|:---|:---|
| **Dual Transformer Architecture** | T5-small for abstractive summarization, GPT-2 for summary-to-text generation |
| **FastAPI Backends** | Two independent, high-performance APIs (ports `8000` & `8001`) with Swagger docs |
| **Modern Frontend** | Next.js 16 + React 19 monochrome UI with WebGL backgrounds (DarkVeil, Dither) and micro-animations |
| **Docker Ready** | Multi-stage Dockerfiles + Docker Compose for one-command stack deployment |
| **Cloud Native** | Render Blueprint for APIs, Vercel for frontend, HuggingFace Hub for model weights |
| **Modular Training** | Separated pipelines with configurable dataclass-based configs (`src/config.py`) |
| **GPU Acceleration** | CUDA-optimized training with FP16 mixed precision via 🤗 Accelerate |
| **ROUGE Evaluation** | Integrated evaluation metrics for summarization quality assessment |
| **Interactive Demo** | Streamlit dashboard for quick local experimentation |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER / BROWSER                          │
│                    http://localhost:3000                         │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Next.js 16    │
                    │   React 19 UI   │
                    │  (Vercel host)  │
                    └──┬──────────┬───┘
                       │          │
          ┌────────────▼──┐  ┌───▼─────────────┐
          │ Summarization │  │ Text Generator   │
          │ API (FastAPI) │  │ API (FastAPI)    │
          │  :8000        │  │  :8001           │
          │  T5-small     │  │  GPT-2           │
          │  (Render)     │  │  (Render)        │
          └───────┬───────┘  └───────┬──────────┘
                  │                  │
          ┌───────▼──────────────────▼──────────┐
          │       🤗 HuggingFace Hub            │
          │  samarthftr/summarizer  (242 MB)    │
          │  samarthftr/Text-generator (498 MB) │
          └─────────────────────────────────────┘
```

---

## 🤗 Pre-trained Models

Fine-tuned model weights are publicly hosted on HuggingFace Hub:

| Model | HuggingFace Repo | Parameters | Size | Task |
|:---|:---|:---|:---|:---|
| T5-small | [`samarthftr/summarizer`](https://huggingface.co/samarthftr/summarizer) | 60M | 242 MB | Abstractive Summarization |
| GPT-2 | [`samarthftr/Text-generator`](https://huggingface.co/samarthftr/Text-generator) | 124M | 498 MB | Text Generation |

Combined the models use **184M+** parameters.

---

## 🛠️ Installation

### Prerequisites

| Tool | Version | Purpose |
|:---|:---|:---|
| Python | 3.11+ | Backend APIs & training |
| Node.js | 20+ | Frontend (Next.js) |
| Docker | Latest | Containerized deployment (optional) |
| CUDA | 11.8+ | GPU training (optional) |

### 1. Clone the Repository

```bash
git clone https://github.com/samarthFTR/Summarize-AI-Transformer.git
cd Summarize-AI-Transformer
```

### 2. Backend Setup

```bash
# Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# Install training dependencies (root-level)
pip install -r requirements.txt

# Install API-specific dependencies for each service
pip install -r summarization/requirements.txt
pip install -r text_generator/requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Environment Variables

Copy the example env file and update with your API URLs:

```bash
cd frontend
cp .env.example .env.local
```

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000          # Summarization API
NEXT_PUBLIC_GENERATOR_API_URL=http://localhost:8001 # Text Generator API
```

---

## 🚀 Usage

### Training the Models

<details>
<summary><strong>Summarization (T5-small)</strong></summary>

```bash
cd summarization
python run.py
```

**Configuration** — edit `summarization/src/config.py`:
- `batch_size`: 16
- `num_epochs`: 3
- `learning_rate`: 5e-5
- `max_input_length`: 512
- `max_target_length`: 128
- `max_samples`: 5,000
- `fp16`: enabled

Training data: CSV with `Text` and `Summary` columns at `data/raw/data.csv`.

</details>

<details>
<summary><strong>Text Generation (GPT-2)</strong></summary>

```bash
cd text_generator
python run.py
```

**Configuration** — edit `text_generator/src/config.py`:
- `batch_size`: 4
- `num_epochs`: 3
- `learning_rate`: 5e-5
- `max_length`: 256
- `max_samples`: 2,000
- `fp16`: enabled

Training data: Shared XSum dataset from the summarization pipeline (reversed columns — Summary → input, Text → target).

**Generation Parameters:**
| Parameter | Default | Description |
|:---|:---|:---|
| `temperature` | 0.7 | Sampling temperature |
| `top_k` | 40 | Top-K filtering |
| `top_p` | 0.90 | Nucleus sampling |
| `repetition_penalty` | 1.4 | Penalize repeated tokens |
| `no_repeat_ngram_size` | 3 | Prevent 3-gram repetition |

</details>

### Starting the APIs

```bash
# Terminal 1 — Summarization API
cd summarization
python api.py
# → http://localhost:8000
# → Swagger Docs: http://localhost:8000/docs

# Terminal 2 — Text Generator API
cd text_generator
python api.py
# → http://localhost:8001
# → Swagger Docs: http://localhost:8001/docs
```

### Starting the Frontend

```bash
cd frontend
npm run dev
# → http://localhost:3000
```

### Streamlit Demo (Summarization)

```bash
cd summarization
streamlit run app.py
```

---

## 📡 API Reference

### Summarization API — `:8000`

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/health` | Health check & model status |
| `POST` | `/api/summarize` | Generate a summary |

**POST `/api/summarize`** — Request Body:
```json
{
  "text": "Your long text to summarize...",
  "max_length": 128,
  "num_beams": 4
}
```

**Response:**
```json
{
  "summary": "Concise summary of the input text.",
  "input_length": 150,
  "output_length": 25,
  "processing_time": 1.234
}
```

### Text Generator API — `:8001`

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/generate/health` | Health check & model status |
| `POST` | `/api/generate` | Generate expanded text |

**POST `/api/generate`** — Request Body:
```json
{
  "summary": "A brief summary or prompt to expand...",
  "max_length": 200,
  "temperature": 0.7,
  "top_k": 40,
  "top_p": 0.90
}
```

**Response:**
```json
{
  "generated_text": "Expanded full article from the summary...",
  "input_length": 12,
  "output_length": 85,
  "processing_time": 2.456
}
```

---

## 🐳 Docker Deployment

Run the entire stack with a single command:

```bash
# Build and start all 3 services
docker compose up --build

# Services:
#   Frontend           → http://localhost:3000
#   Summarization API  → http://localhost:8000
#   Text Generator API → http://localhost:8001
```

Models are **pre-downloaded from HuggingFace Hub** during the Docker build stage, so container startup is fast. Each API image uses **CPU-only PyTorch** to keep image sizes minimal.

**Health Checks** are configured for both API services with 30s intervals and 60s start periods.

---

## ☁️ Cloud Deployment

### APIs → Render

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect your repo — Render auto-detects `render.yaml`
4. Click **Apply** to deploy both API services

The `render.yaml` blueprint configures:
- `summarize-ai-summarization` — T5 API on Docker runtime
- `summarize-ai-generator` — GPT-2 API on Docker runtime
- Oregon region, Starter plan, with health checks

### Frontend → Vercel

1. Go to [Vercel](https://vercel.com) → **Add New Project** → Import repo
2. Set **Root Directory** to `frontend`
3. Add **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-summarization-api.onrender.com
   NEXT_PUBLIC_GENERATOR_API_URL=https://your-generator-api.onrender.com
   ```
4. Click **Deploy**

### Models → HuggingFace Hub

Upload fine-tuned models using the included utility:

```bash
# Login to HuggingFace
pip install huggingface_hub
huggingface-cli login

# Upload models
python upload_models.py
```

---

## 📂 Project Structure

```
Summarize-AI-Transformer/
│
├── summarization/               # T5 Summarization Service
│   ├── api.py                   # FastAPI server (port 8000)
│   ├── app.py                   # Streamlit demo
│   ├── run.py                   # Training entry point
│   ├── Dockerfile               # CPU-optimized Docker image
│   ├── requirements.txt         # API dependencies
│   └── src/
│       ├── config.py            # Dataclass-based configuration
│       ├── data/                # Data loading & preprocessing
│       ├── training/            # Training loop & utilities
│       ├── inference/           # Inference logic
│       └── evaluation/          # ROUGE metric calculation
│
├── text_generator/              # GPT-2 Text Generation Service
│   ├── api.py                   # FastAPI server (port 8001)
│   ├── run.py                   # Training entry point
│   ├── Dockerfile               # CPU-optimized Docker image
│   ├── requirements.txt         # API dependencies
│   └── src/
│       ├── config.py            # Dataclass-based configuration
│       ├── data/                # Data loading & tokenization
│       ├── training/            # Training loop
│       └── inference/           # Text generation logic
│
├── frontend/                    # Next.js 16 + React 19 Frontend
│   ├── src/app/
│   │   ├── page.js              # Landing page (Hero, Features, Architecture)
│   │   ├── summarize/page.js    # Summarization interface
│   │   ├── generate/page.js     # Text generation interface
│   │   ├── components/          # Navbar, Hero, Features, Footer, etc.
│   │   │   ├── DarkVeil/        # WebGL background (landing page)
│   │   │   └── Dither/          # WebGL background (tool pages)
│   │   └── globals.css          # Design system & monochrome theme
│   ├── Dockerfile               # Multi-stage production build
│   ├── .env.example             # Environment variable template
│   └── package.json
│
├── docker-compose.yml           # Orchestrate all 3 services
├── render.yaml                  # Render Blueprint (auto-deploy)
├── upload_models.py             # Push models to HuggingFace Hub
├── requirements.txt             # Root training dependencies
└── README.md
```

---

## 🧰 Tech Stack

| Layer | Technology |
|:---|:---|
| **Summarization Model** | T5-small (60M params) via 🤗 Transformers |
| **Generation Model** | GPT-2 (124M params) via 🤗 Transformers |
| **Training** | PyTorch 2.0+, 🤗 Accelerate, FP16 mixed precision |
| **Evaluation** | ROUGE scores via 🤗 Evaluate |
| **Backend** | FastAPI, Uvicorn, Pydantic v2 |
| **Frontend** | Next.js 16, React 19, CSS Modules |
| **Visual Effects** | Three.js, React Three Fiber, OGL (WebGL) |
| **Containerization** | Docker, Docker Compose |
| **Cloud (APIs)** | Render (Docker runtime) |
| **Cloud (Frontend)** | Vercel |
| **Model Hosting** | HuggingFace Hub |

---

## 🚧 Status & Roadmap

- [x] **Summarization Pipeline** — T5-small fine-tuned on XSum dataset
- [x] **Text Generation Pipeline** — GPT-2 fine-tuned with summary-to-text mapping
- [x] **Dual FastAPI Backends** — Independent, CORS-enabled, health-checked APIs
- [x] **Modern Frontend** — Monochrome UI with WebGL backgrounds & animations
- [x] **Docker Compose** — Full containerization with health checks
- [x] **HuggingFace Hub** — Model weights hosted & versioned
- [x] **Cloud Deployment** — Render + Vercel configurations ready
- [x] **Streamlit Demo** — Interactive summarization testing
- [ ] **Advanced Evaluation Metrics** — BLEU, METEOR, BERTScore
- [ ] **Batch Processing** — Multi-document summarization support
- [ ] **Model Comparison** — Side-by-side output from different model sizes

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [`LICENSE`](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ using Transformers, FastAPI, and Next.js
</p>
