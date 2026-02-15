# Summarize AI Transformer

![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95%2B-009688)
![Next.js](https://img.shields.io/badge/Next.js-13%2B-black)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)

**Summarize AI Transformer** is a comprehensive, full-stack toolkit for text summarization. It combines the power of Transformer-based models (defaulting to T5-small) with a robust production-ready architecture.

This project offers a complete pipeline: from data preprocessing and fine-tuning to deployment via a **FastAPI** backend and a modern **Next.js** frontend. A **Streamlit** app is also included for rapid prototyping.

## 🚀 Key Features

*   **Transformer Architecture**: Fine-tuned **T5 (Text-to-Text Transfer Transformer)** model optimized for summarization tasks.
*   **Modular Training Pipeline**: Clean separation of concerns for data loading, training, evaluation, and inference.
*   **Full-Stack Application**:
    *   **Backend**: High-performance API built with **FastAPI**.
    *   **Frontend**: Sleek, monochrome User Interface built with **Next.js 16** and **React 19**.
    *   **Demo**: Interactive **Streamlit** dashboard for quick testing.
*   **Configurable**: Centralized configuration management via `src/config.py`.
*   **Evaluation Metrics**: Integrated **ROUGE** score calculation for reliable quality assessment.
*   **GPU Acceleration**: Optimized for CUDA-enabled environments for faster training and inference.
*   **Checkpointing**: Automatic model checkpointing to ensure training progress is saved.

## 🛠️ Installation

### Prerequisites
*   Python 3.8+
*   Node.js 18+ (for frontend)

### 1. Backend Setup (Core + API)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/Summarize-AI-Transformer.git
    cd Summarize-AI-Transformer
    ```

2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    # On Windows:
    venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

### 2. Frontend Setup (Next.js)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install Node dependencies:**
    ```bash
    npm install
    ```

## 🏃 Usage

You can run the different components of the application independently.

### 1. Training the Model
To start the fine-tuning process on your data:
```bash
python run.py
```
*This will preprocess data, train the model, save checkpoints to `models/`, and log metrics.*

### 2. Starting the Backend API
To serve the trained model via a REST API:
```bash
uvicorn api:app --reload
```
*   **API Documentation**: `http://localhost:8000/docs`
*   **Health Check**: `http://localhost:8000/api/health`

### 3. Running the Frontend
To launch the user interface:
```bash
cd frontend
npm run dev
```
*Access the application at `http://localhost:3000`.*

### 4. Running the Streamlit Demo
For a quick, standalone interface:
```bash
streamlit run app.py
```

## 📊 Data Preparation

The training pipeline requires a CSV file at `data/raw/data.csv` with the following columns:

| Column Name | Description |
| :--- | :--- |
| `Text` | The full text article or document to be summarized. |
| `Summary` | The ground truth summary. |

*Note: You can configure input paths and column mapping in `src/config.py`.*

## 📂 Project Structure

```plaintext
Summarize-AI-Transformer/
├── api.py               # FastAPI backend entry point
├── app.py               # Streamlit demo application
├── run.py               # Main training script entry point
├── src/
│   ├── config.py        # Central configuration file
│   ├── data/            # Data loading & preprocessing
│   ├── training/        # Training loop & trainer utilities
│   ├── inference/       # Inference logic
│   └── evaluation/      # Metric calculation (ROUGE)
├── frontend/            # Next.js Frontend Application
│   ├── src/             # Frontend source code
│   ├── public/          # Static assets
│   └── package.json     # Frontend dependencies
├── models/              # Saved model checkpoints
├── data/                # Dataset store
│   └── raw/             # Input CSV files
└── requirements.txt     # Python backend dependencies
```

## 🚧 Status & Roadmap

*   ✅ **Training Pipeline**: Fully functional T5 fine-tuning.
*   ✅ **Backend API**: FastAPI integration complete.
*   ✅ **Frontend**: Modern Next.js UI implemented.
*   ✅ **Demo App**: Streamlit dashboard available.
*   🚧 **Advanced Metrics**: Additional evaluation metrics planned.
*   🚧 **Deployment**: Docker support coming soon.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
