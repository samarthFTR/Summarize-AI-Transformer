import pandas as pd
from datasets import Dataset
from transformers import (
    T5Tokenizer,
    T5ForConditionalGeneration,
    Seq2SeqTrainer,
    Seq2SeqTrainingArguments,
)

from src.config import config
from src.training.trainer_utils import (
    build_preprocess_function,
    build_data_collator,
    build_compute_metrics,
)


def train():

    # Ensure directories exist
    config.paths.create_dirs()

    # Load data
    df = pd.read_csv(config.data.raw_data_path)

    df = df[[config.data.text_column, config.data.summary_column]].dropna()

    if config.data.max_samples:
        df = df.head(config.data.max_samples)

    dataset = Dataset.from_pandas(df)

    # Train/Validation split
    dataset = dataset.train_test_split(
        test_size=config.training.validation_split
    )

    # Load pretrained model & tokenizer
    tokenizer = T5Tokenizer.from_pretrained(config.model.model_name)
    model = T5ForConditionalGeneration.from_pretrained(config.model.model_name)

    # Preprocessing
    preprocess_function = build_preprocess_function(tokenizer, config)
    dataset = dataset.map(preprocess_function, batched=True)

    # Data collator
    data_collator = build_data_collator(tokenizer, model)

    # Metrics
    compute_metrics = build_compute_metrics(tokenizer)

    # Training arguments
    training_args = Seq2SeqTrainingArguments(
        output_dir=config.paths.model_dir,
        per_device_train_batch_size=config.training.batch_size,
        per_device_eval_batch_size=config.training.batch_size,
        num_train_epochs=config.training.num_epochs,
        learning_rate=config.training.learning_rate,
        weight_decay=config.training.weight_decay,
        warmup_steps=config.training.warmup_steps,
        fp16=config.training.fp16,
        logging_steps=config.training.logging_steps,
        eval_strategy="epoch",
        save_strategy=config.training.save_strategy,
        load_best_model_at_end=True,
        metric_for_best_model="loss",
        greater_is_better=False,
        report_to="none",
        predict_with_generate=False,
        disable_tqdm=False
    )

    # Trainer
    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=dataset["train"],
        eval_dataset=dataset["test"],
        processing_class=tokenizer,
        data_collator=data_collator
    )

    # Train
    trainer.train()

    # Save final model
    trainer.save_model(config.paths.model_dir)
    tokenizer.save_pretrained(config.paths.model_dir)

    print("Training complete and model saved.")


if __name__ == "__main__":
    train()
