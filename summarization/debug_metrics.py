import numpy as np
import evaluate
from transformers import T5Tokenizer
from src.config import config

def test_metrics():
    print("Loading tokenizer...")
    tokenizer = T5Tokenizer.from_pretrained(config.model.model_name)
    
    print("Loading rouge metric...")
    try:
        rouge = evaluate.load("rouge")
    except Exception as e:
        print(f"Failed to load rouge: {e}")
        return

    print("Generating dummy predictions and labels...")
    # Simulate a batch of 2 examples
    # Preds: "hello world", "failed summary"
    # Labels: "hello world", "summary"
    
    preds_text = ["hello world", "failed summary"]
    labels_text = ["hello world", "summary"]
    
    preds = tokenizer(preds_text, padding="max_length", max_length=128, return_tensors="np")["input_ids"]
    labels = tokenizer(labels_text, padding="max_length", max_length=128, return_tensors="np")["input_ids"]
    
    # Replace padding with -100 in labels as per Trainer standard
    labels = np.where(labels == tokenizer.pad_token_id, -100, labels)
    
    # Mock eval_preds
    eval_preds = (preds, labels)
    
    print("Running compute_metrics logic...")
    
    try:
        # Simplified logic from trainer_utils.py
        decoded_preds = tokenizer.batch_decode(preds, skip_special_tokens=True)
        
        # Restore labels from -100
        labels = np.where(labels != -100, labels, tokenizer.pad_token_id)
        decoded_labels = tokenizer.batch_decode(labels, skip_special_tokens=True)
        
        print(f"Decoded Preds: {decoded_preds}")
        print(f"Decoded Labels: {decoded_labels}")
        
        result = rouge.compute(predictions=decoded_preds, references=decoded_labels)
        print("Metrics computed successfully:")
        print(result)
        
    except Exception as e:
        print(f"CRASHED in compute_metrics logic: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_metrics()
