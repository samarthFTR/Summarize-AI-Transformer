from dataclasses import dataclass, field
import os

# Base directory for the text_generator project
_TEXT_GEN_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Root project directory (parent of text_generator/)
_PROJECT_ROOT = os.path.dirname(_TEXT_GEN_DIR)

# HuggingFace Hub repo ID (used in production / Docker)
_HF_REPO_ID = "samarthftr/Text-generator"


@dataclass
class ModelConfig:
    # Pretrained model
    model_name: str = "gpt2"

    # Tokenization
    max_length: int = 256          # Shorter context = much faster training

    # Generation settings
    max_gen_length: int = 150      # Max tokens to generate
    temperature: float = 0.7       # Lower = more focused, less random
    top_k: int = 40                # Restrict to top 40 probable tokens
    top_p: float = 0.90            # Nucleus sampling — tighter probability mass
    num_beams: int = 1             # 1 = greedy/sampling, >1 = beam search
    do_sample: bool = True
    repetition_penalty: float = 1.4  # Stronger penalty for repeated tokens
    no_repeat_ngram_size: int = 3    # Prevent any 3-gram from repeating


@dataclass
class TrainingConfig:
    # Training hyperparameters
    batch_size: int = 4
    gradient_accumulation_steps: int = 1   # No accumulation = faster steps
    num_epochs: int = 3
    learning_rate: float = 5e-5
    weight_decay: float = 0.01
    fp16: bool = True

    # Scheduler / warmup
    warmup_steps: int = 200

    # Validation
    validation_split: float = 0.1

    # Logging
    logging_steps: int = 50
    save_strategy: str = "epoch"


@dataclass
class DataConfig:
    # Data source — shared xsum dataset from summarization
    data_path: str = os.path.join(
        _PROJECT_ROOT, "summarization", "data", "processed", "xsum_train.csv"
    )

    # Column mapping (REVERSED from summarization)
    # x_train = Summary (input/prompt), y_train = Text (target/output)
    input_column: str = "Summary"    # This becomes the prompt
    target_column: str = "Text"      # This is what the model learns to generate

    # Dataset limit
    max_samples: int = 2000

    # Special tokens
    separator: str = " <|sep|> "
    prompt_prefix: str = "Expand: "


@dataclass
class PathConfig:
    # Model source: use HuggingFace Hub in production, local path for development
    # Set HF_MODEL_REPO env var to load from HuggingFace Hub
    model_dir: str = os.environ.get(
        "HF_MODEL_REPO",
        os.path.join(_TEXT_GEN_DIR, "models", "gpt2-finetuned")
    )

    # HuggingFace Hub repo ID (for reference / upload scripts)
    hf_repo_id: str = _HF_REPO_ID

    # Logging directory
    log_dir: str = os.path.join(_TEXT_GEN_DIR, "logs")

    def create_dirs(self):
        os.makedirs(self.model_dir, exist_ok=True)
        os.makedirs(self.log_dir, exist_ok=True)


# Combined Config
@dataclass
class Config:
    model: ModelConfig = field(default_factory=ModelConfig)
    training: TrainingConfig = field(default_factory=TrainingConfig)
    data: DataConfig = field(default_factory=DataConfig)
    paths: PathConfig = field(default_factory=PathConfig)


# Instantiate default config
config = Config()
