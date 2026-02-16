"""
GPT-2 fine-tuning training script.

Fine-tunes GPT-2 on Summary -> Text generation task.
Uses HuggingFace Trainer with causal LM objective.
"""

import torch
from transformers import (
    GPT2LMHeadModel,
    GPT2Tokenizer,
    Trainer,
    TrainingArguments,
    DataCollatorForLanguageModeling,
)

from src.config import config
from src.data.load_data import load_dataset_from_csv, build_train_val_split
from src.data.preprocess import TextGenDataset, setup_tokenizer


def train():
    """Main training function for GPT-2 fine-tuning."""

    # Ensure directories exist
    config.paths.create_dirs()

    # ---- 1. Load Data ----
    print("=" * 60)
    print("STEP 1: Loading Data")
    print("=" * 60)
    dataset = load_dataset_from_csv()
    splits = build_train_val_split(dataset)

    # ---- 2. Load Pretrained Model & Tokenizer ----
    print("\n" + "=" * 60)
    print("STEP 2: Loading GPT-2 Model & Tokenizer")
    print("=" * 60)

    tokenizer = GPT2Tokenizer.from_pretrained(config.model.model_name)
    tokenizer = setup_tokenizer(tokenizer)

    model = GPT2LMHeadModel.from_pretrained(config.model.model_name)

    # Resize embeddings if new tokens were added
    model.resize_token_embeddings(len(tokenizer))

    print(f"Model: {config.model.model_name}")
    print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")
    print(f"Vocab size: {len(tokenizer)}")

    # ---- 3. Create PyTorch Datasets ----
    print("\n" + "=" * 60)
    print("STEP 3: Preparing Datasets")
    print("=" * 60)

    train_dataset = TextGenDataset(splits["train"], tokenizer, config)
    val_dataset = TextGenDataset(splits["test"], tokenizer, config)

    print(f"Train samples: {len(train_dataset)}")
    print(f"Validation samples: {len(val_dataset)}")

    # ---- 4. Training Arguments ----
    print("\n" + "=" * 60)
    print("STEP 4: Starting Training")
    print("=" * 60)

    training_args = TrainingArguments(
        output_dir=config.paths.model_dir,
        per_device_train_batch_size=config.training.batch_size,
        per_device_eval_batch_size=config.training.batch_size,
        gradient_accumulation_steps=config.training.gradient_accumulation_steps,
        num_train_epochs=config.training.num_epochs,
        learning_rate=config.training.learning_rate,
        weight_decay=config.training.weight_decay,
        warmup_steps=config.training.warmup_steps,
        fp16=config.training.fp16,
        logging_steps=config.training.logging_steps,
        eval_strategy="epoch",
        save_strategy=config.training.save_strategy,
        load_best_model_at_end=True,
        metric_for_best_model="eval_loss",
        greater_is_better=False,
        report_to="none",
        disable_tqdm=False,
        logging_dir=config.paths.log_dir,
    )

    # ---- 5. Trainer ----
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
    )

    # Train
    trainer.train()

    # ---- 6. Save final model ----
    print("\n" + "=" * 60)
    print("STEP 5: Saving Model")
    print("=" * 60)

    trainer.save_model(config.paths.model_dir)
    tokenizer.save_pretrained(config.paths.model_dir)

    print(f"Model saved to: {config.paths.model_dir}")
    print("Training complete!")


if __name__ == "__main__":
    train()
