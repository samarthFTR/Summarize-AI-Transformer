"""
Data loading and preprocessing for GPT-2 text generation.

The task is REVERSED from summarization:
  - Input (prompt): Summary
  - Target (generation): Full text

For GPT-2 (causal LM), we concatenate: prompt + separator + target
The model learns to predict the next token across the full sequence,
but we mask the loss on the prompt tokens so it only learns to generate the target.
"""

import pandas as pd
from datasets import Dataset
from src.config import config


def load_dataset_from_csv(data_path=None, max_samples=None):
    """
    Load and prepare the dataset from CSV.
    Returns a HuggingFace Dataset with 'input' and 'target' columns.
    """
    data_path = data_path or config.data.data_path
    max_samples = max_samples or config.data.max_samples

    print(f"Loading data from: {data_path}")
    df = pd.read_csv(data_path)

    # Select and rename columns (Summary → input, Text → target)
    df = df[[config.data.input_column, config.data.target_column]].dropna()

    if max_samples:
        df = df.head(max_samples)

    df = df.rename(columns={
        config.data.input_column: "input",
        config.data.target_column: "target",
    })

    print(f"Loaded {len(df)} samples")
    print(f"  Input column (prompt): '{config.data.input_column}' → Summary")
    print(f"  Target column (generation): '{config.data.target_column}' → Text")

    dataset = Dataset.from_pandas(df, preserve_index=False)
    return dataset


def build_train_val_split(dataset, val_split=None):
    """Split dataset into train and validation sets."""
    val_split = val_split or config.training.validation_split
    split = dataset.train_test_split(test_size=val_split, seed=42)
    print(f"Train: {len(split['train'])} | Validation: {len(split['test'])}")
    return split
