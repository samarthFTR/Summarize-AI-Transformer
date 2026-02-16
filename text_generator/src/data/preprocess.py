"""
Tokenization and preprocessing utilities for GPT-2 causal LM fine-tuning.

Key design:
  - Each sample is formatted as:  Expand: {summary} [SEP] {full_text} [EOS]
  - The model sees the entire sequence but loss is computed only on the
    target portion (after the separator), so it learns to generate text
    given a summary prompt.
"""

import torch
from torch.utils.data import Dataset as TorchDataset


class TextGenDataset(TorchDataset):
    """
    PyTorch Dataset for GPT-2 fine-tuning.
    Tokenizes prompt+target into a single sequence with labels masked
    on the prompt portion.
    """

    def __init__(self, hf_dataset, tokenizer, config):
        self.data = hf_dataset
        self.tokenizer = tokenizer
        self.max_length = config.model.max_length
        self.separator = config.data.separator
        self.prefix = config.data.prompt_prefix

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        row = self.data[idx]
        prompt = self.prefix + row["input"]
        target = row["target"]

        # Build full sequence: prompt + separator + target + eos
        full_text = prompt + self.separator + target + self.tokenizer.eos_token

        # Tokenize the full sequence
        encodings = self.tokenizer(
            full_text,
            max_length=self.max_length,
            truncation=True,
            padding="max_length",
            return_tensors="pt",
        )

        input_ids = encodings["input_ids"].squeeze(0)
        attention_mask = encodings["attention_mask"].squeeze(0)

        # Build labels: mask the prompt portion with -100
        # so loss is only computed on the target tokens
        prompt_with_sep = prompt + self.separator
        prompt_ids = self.tokenizer(
            prompt_with_sep,
            truncation=True,
            max_length=self.max_length,
            return_tensors="pt",
        )["input_ids"].squeeze(0)

        prompt_len = len(prompt_ids)

        labels = input_ids.clone()
        labels[:prompt_len] = -100  # Mask prompt tokens from loss
        # Also mask padding tokens
        labels[attention_mask == 0] = -100

        return {
            "input_ids": input_ids,
            "attention_mask": attention_mask,
            "labels": labels,
        }


def setup_tokenizer(tokenizer):
    """
    Configure the GPT-2 tokenizer with required special tokens.
    GPT-2 doesn't have a pad token by default, so we set one.
    """
    # Set pad token to eos token (standard GPT-2 practice)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
        tokenizer.pad_token_id = tokenizer.eos_token_id

    # Add separator token if not already present
    special_tokens = {"additional_special_tokens": ["<|sep|>"]}
    num_added = tokenizer.add_special_tokens(special_tokens)

    if num_added > 0:
        print(f"Added {num_added} special token(s) to tokenizer")

    return tokenizer
