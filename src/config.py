from dataclasses import dataclass
import os


@dataclass
class ModelConfig:
    # Pretrained model
    model_name: str = "t5-small"

    # Tokenization
    max_input_length: int = 512
    max_target_length: int = 128

    # Generation settings
    num_beams: int = 4
    early_stopping: bool = True


@dataclass
class TrainingConfig:
    # Training hyperparameters
    batch_size: int = 8
    num_epochs: int = 3
    learning_rate: float = 5e-5
    weight_decay: float = 0.01

    # Scheduler / warmup
    warmup_steps: int = 500

    # Validation
    validation_split: float = 0.1

    # Logging
    logging_steps: int = 50
    save_strategy: str = "epoch"


@dataclass
class DataConfig:
    # Data paths
    raw_data_path: str = os.path.join("data", "raw", "data.csv")
    processed_data_path: str = os.path.join("data", "processed")

    # Column names in CSV
    text_column: str = "Text"
    summary_column: str = "Summary"

    # Optional dataset limit 
    max_samples: int | None = 5000


@dataclass
class PathConfig:
    # Model saving directory
    model_dir: str = os.path.join("models", "t5-small")

    # Logging directory
    log_dir: str = os.path.join("logs")

    def create_dirs(self):
        os.makedirs(self.model_dir, exist_ok=True)
        os.makedirs(self.log_dir, exist_ok=True)


# Combined Config
@dataclass
class Config:
    model: ModelConfig = ModelConfig()
    training: TrainingConfig = TrainingConfig()
    data: DataConfig = DataConfig()
    paths: PathConfig = PathConfig()


# Instantiate default config
config = Config()
