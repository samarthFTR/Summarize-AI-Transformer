"""
Inference module for GPT-2 text generation.

Given a summary as input, generates the expanded full text
using the fine-tuned GPT-2 model.
"""

import sys
import os

# Ensure the project root is in the python path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(project_root)

import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer
from src.config import config


def load_model(model_dir=None):
    """Load the fine-tuned GPT-2 model and tokenizer."""
    model_dir = model_dir or config.paths.model_dir

    print(f"Loading model from: {model_dir}")
    tokenizer = GPT2Tokenizer.from_pretrained(model_dir)
    model = GPT2LMHeadModel.from_pretrained(model_dir)

    # Ensure pad token is set
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    model.eval()
    return tokenizer, model


def generate_text(
    summary,
    tokenizer,
    model,
    max_length=None,
    temperature=None,
    top_k=None,
    top_p=None,
    num_beams=None,
    do_sample=None,
    repetition_penalty=None,
):
    """
    Generate expanded text from a given summary.

    Args:
        summary: The summary/prompt to expand into full text.
        tokenizer: GPT2Tokenizer instance.
        model: GPT2LMHeadModel instance.
        max_length: Max tokens to generate (defaults to config).
        temperature: Sampling temperature.
        top_k: Top-K filtering value.
        top_p: Nucleus sampling probability.
        num_beams: Number of beams for beam search.
        do_sample: Whether to use sampling.
        repetition_penalty: Penalty for repeating tokens.

    Returns:
        Generated text string.
    """
    # Use config defaults if not specified
    max_length = max_length or config.model.max_gen_length
    temperature = temperature or config.model.temperature
    top_k = top_k or config.model.top_k
    top_p = top_p or config.model.top_p
    num_beams = num_beams or config.model.num_beams
    do_sample = do_sample if do_sample is not None else config.model.do_sample
    repetition_penalty = repetition_penalty or config.model.repetition_penalty

    # Build the prompt (same format as training)
    prompt = config.data.prompt_prefix + summary + config.data.separator

    # Tokenize
    input_ids = tokenizer.encode(prompt, return_tensors="pt")

    # Move to same device as model
    device = next(model.parameters()).device
    input_ids = input_ids.to(device)

    # Generate
    with torch.no_grad():
        output_ids = model.generate(
            input_ids,
            max_new_tokens=max_length,
            temperature=temperature,
            top_k=top_k,
            top_p=top_p,
            num_beams=num_beams,
            do_sample=do_sample,
            repetition_penalty=repetition_penalty,
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=tokenizer.eos_token_id,
        )

    # Decode only the generated part (skip the prompt tokens)
    generated_ids = output_ids[0][len(input_ids[0]):]
    generated_text = tokenizer.decode(generated_ids, skip_special_tokens=True)

    # Clean up separator artifacts if any
    generated_text = generated_text.replace("<|sep|>", "").strip()

    return generated_text


if __name__ == "__main__":
    # Example usage
    tokenizer, model = load_model()

    sample_summary = (
        "A new study has found that regular exercise can significantly "
        "reduce the risk of heart disease in middle-aged adults."
    )

    print("=" * 60)
    print("INPUT SUMMARY:")
    print("=" * 60)
    print(sample_summary)
    print()
    print("=" * 60)
    print("GENERATED TEXT:")
    print("=" * 60)
    generated = generate_text(sample_summary, tokenizer, model)
    print(generated)
