import sys
import os

# Ensure the project root is in the python path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(project_root)

import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration
from src.config import config

def predict(text):
    # Load model and tokenizer
    tokenizer = T5Tokenizer.from_pretrained(config.paths.model_dir)
    model = T5ForConditionalGeneration.from_pretrained(config.paths.model_dir)
    
    # Prepare input
    input_text = "summarize: " + text
    input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=config.model.max_input_length, truncation=True)

    # Generate summary
    summary_ids = model.generate(
        input_ids,
        max_length=config.model.max_target_length,
        num_beams=config.model.num_beams,
        early_stopping=config.model.early_stopping
    )

    # Decode summary
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

if __name__ == "__main__":
    # Example usage
    sample_text = """
    The Transformer is a deep learning model introduced in 2017 by Google. 
    It is primarily used in the field of natural language processing (NLP). 
    Unlike recurrent neural networks (RNNs), Transformers process the entire input all at once. 
    The attention mechanism allows the model to weigh the influence of different parts of the input data.
    """
    print("Original Text:\n", sample_text)
    print("\nSummary:\n", predict(sample_text))
