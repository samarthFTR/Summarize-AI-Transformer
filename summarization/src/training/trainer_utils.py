import numpy as np
import evaluate
from transformers import DataCollatorForSeq2Seq


def build_preprocess_function(tokenizer, config):
    """
    Returns a preprocessing function for HuggingFace Dataset.map()
    """

    def preprocess_function(examples):
        inputs = ["summarize: " + text for text in examples[config.data.text_column]]

        model_inputs = tokenizer(
            inputs,
            max_length=config.model.max_input_length,
            truncation=True,
        )

        labels = tokenizer(
            examples[config.data.summary_column],
            max_length=config.model.max_target_length,
            truncation=True,
        )

        model_inputs["labels"] = labels["input_ids"]
        return model_inputs

    return preprocess_function


def build_data_collator(tokenizer, model):
    return DataCollatorForSeq2Seq(
        tokenizer=tokenizer,
        model=model
    )


def build_compute_metrics(tokenizer):
    rouge = evaluate.load("rouge")

    def compute_metrics(eval_preds):
        preds, labels = eval_preds

        if isinstance(preds, tuple):
            preds = preds[0]

        decoded_preds = tokenizer.batch_decode(
            preds,
            skip_special_tokens=True
        )

        labels = np.where(labels != -100, labels, tokenizer.pad_token_id)
        decoded_labels = tokenizer.batch_decode(
            labels,
            skip_special_tokens=True
        )

        result = rouge.compute(
            predictions=decoded_preds,
            references=decoded_labels
        )

        return {
            "rouge1": result["rouge1"],
            "rouge2": result["rouge2"],
            "rougeL": result["rougeL"],
        }

    return compute_metrics
