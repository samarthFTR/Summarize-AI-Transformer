
# Summarize AI Transformer

![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-wip-orange)

**Summarize AI Transformer** is a comprehensive toolkit for fine-tuning Transformer-based models (defaulting to T5-small) on text summarization tasks. It provides a modular pipeline for data loading, preprocessing, training, and evaluation, leveraging the power of Hugging Face `transformers` and `datasets`.

## 🚀 Key Features

*   **Transformer Architecture**: Built on top of the robust T5 (Text-to-Text Transfer Transformer) architecture.
*   **Modular Design**: Clean separation of concerns with dedicated modules for configuration, data handling, training, and inference.
*   **Configurable**: All hyperparameters (learning rate, batch size, model name) are easily adjustable via `src/config.py`.
*   **Evaluation Metrics**: Integrated ROUGE score calculation for reliable summarization quality assessment.
*   **Checkpointing**: Automatic model checkpointing during training to ensure progress is saved.

## 🛠️ Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/Summarize-AI-Transformer.git
    cd Summarize-AI-Transformer
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    # On Windows
    venv\Scripts\activate
    # On macOS/Linux
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## 📊 Data Preparation

The training pipeline expects a CSV file located at `data/raw/data.csv` with the following columns:

| Column Name | Description |
| :--- | :--- |
| `Text` | The full text article or document to be summarized. |
| `Summary` | The ground truth summary. |

*Note: You can configure the input file path and column names in `src/config.py`.*

## 🏃 Usage

### 1. Configuration
Adjust training parameters in `src/config.py`. Common settings include:
*   `max_input_length`: Maximum token length for input text.
*   `batch_size`: Batch size for training and evaluation.
*   `num_epochs`: Number of training epochs.
*   `model_name`: Pre-trained model identifier (e.g., `t5-small`, `t5-base`).

### 2. Training
To start the fine-tuning process, run the main script:

```bash
python run.py
```

This will:
1.  Load and preprocess the data.
2.  Fine-tune the model.
3.  Save checkpoints to `models/`.
4.  Log training metrics.

## 📂 Project Structure

```plaintext
Summarize-AI-Transformer/
├── data/
│   ├── raw/             # Raw input data (data.csv)
│   └── processed/       # Processed datasets (optional)
├── models/              # Saved model checkpoints
├── src/
│   ├── config.py        # Central configuration file
│   ├── data/            # Data loading and preprocessing scripts
│   ├── training/        # Training loop and utilities
│   │   ├── train.py     # Main training logic
│   │   └── trainer_utils.py # Helper functions for Trainer
│   ├── inference/       # Inference scripts (WIP)
│   └── evaluation/      # Evaluation metrics (WIP)
├── run.py               # Entry point for the application
├── requirements.txt     # Python dependencies
└── README.md            # Project documentation
```

## 🚧 Status & Roadmap

*   ✅ **Training Pipeline**: Fully implemented support for T5 fine-tuning.
*   ✅ **Evaluation**: ROUGE score integration is active during training.
*   🚧 **Inference**: Scripts for generating summaries from trained models are currently under development (`src/inference/`).
*   🚧 **Evaluation Script**: Standalone evaluation script is planned (`src/evaluation/`).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
