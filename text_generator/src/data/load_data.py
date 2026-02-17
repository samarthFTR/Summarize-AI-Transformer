"""
Data loading and preprocessing for GPT-2 text generation.

The task is REVERSED from summarization:
  - Input (prompt): Summary
  - Target (generation): Full text

For GPT-2 (causal LM), we concatenate: prompt + separator + target
The model learns to predict the next token across the full sequence,
but we mask the loss on the prompt tokens so it only learns to generate the target.

IMPORTANT: We filter out samples where the full sequence exceeds
the max token limit, so the model always sees complete articles.
"""

import pandas as pd
from datasets import Dataset
from transformers import GPT2Tokenizer
from src.config import config


def load_dataset_from_csv(data_path=None, max_samples=None):
    """
    Load and prepare the dataset from CSV.
    Filters out samples that would be truncated during training.
    Returns a HuggingFace Dataset with 'input' and 'target' columns.
    """
    data_path = data_path or config.data.data_path
    max_samples = max_samples or config.data.max_samples

    print(f"Loading data from: {data_path}")
    df = pd.read_csv(data_path)

    # Select and rename columns (Summary → input, Text → target)
    df = df[[config.data.input_column, config.data.target_column]].dropna()
    print(f"Total samples in CSV: {len(df)}")

    # --- Filter out samples that won't fit in the context window ---
    # This is critical: GPT-2 sees prompt+target as one sequence.
    # If truncated, the model learns incomplete/garbled patterns.
    tokenizer = GPT2Tokenizer.from_pretrained(config.model.model_name)
    max_tokens = config.model.max_length
    prefix = config.data.prompt_prefix
    separator = config.data.separator

    # Estimate token counts and filter
    print(f"Filtering samples that fit within {max_tokens} tokens...")
    valid_indices = []
    for idx in range(len(df)):
        row = df.iloc[idx]
        full_text = (
            prefix + row[config.data.input_column]
            + separator
            + row[config.data.target_column]
            + tokenizer.eos_token
        )
        token_count = len(tokenizer.encode(full_text))
        if token_count <= max_tokens:
            valid_indices.append(idx)
        # Stop early once we have enough candidates
        if len(valid_indices) >= max_samples * 2:
            break

    df = df.iloc[valid_indices]
    print(f"Samples that fit in {max_tokens} tokens: {len(df)}")

    if max_samples and len(df) > max_samples:
        df = df.head(max_samples)

    df = df.rename(columns={
        config.data.input_column: "input",
        config.data.target_column: "target",
    })

    print(f"Final training samples: {len(df)}")
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
