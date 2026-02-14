import streamlit as st
import sys
import os
from transformers import T5Tokenizer, T5ForConditionalGeneration

# Ensure the project root is in the python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.config import config

# Page config
st.set_page_config(
    page_title="AI Text Summarizer",
    page_icon="🤖",
    layout="centered"
)

@st.cache_resource
def load_model():
    """Load model and tokenizer only once to improve performance."""
    try:
        tokenizer = T5Tokenizer.from_pretrained(config.paths.model_dir)
        model = T5ForConditionalGeneration.from_pretrained(config.paths.model_dir)
        return tokenizer, model
    except Exception as e:
        st.error(f"Error loading model: {e}")
        return None, None

def generate_summary(text, tokenizer, model):
    """Generate summary for the given text."""
    input_text = "summarize: " + text
    input_ids = tokenizer.encode(
        input_text, 
        return_tensors="pt", 
        max_length=config.model.max_input_length, 
        truncation=True
    )

    summary_ids = model.generate(
        input_ids,
        max_length=config.model.max_target_length,
        num_beams=config.model.num_beams,
        early_stopping=config.model.early_stopping
    )

    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

# --- UI Layout ---
st.title("🤖 AI Text Summarizer")
st.markdown("Enter a long paragraph below, and the AI will generate a concise summary for you.")

# Text Input
text_input = st.text_area("Input Text", height=200, placeholder="Paste your text here...")

# Load Model
with st.spinner("Loading model..."):
    tokenizer, model = load_model()

# Summarize Button
if st.button("Summarize", type="primary"):
    if not text_input:
        st.warning("Please enter some text first.")
    elif tokenizer is None or model is None:
        st.error("Model failed to load.")
    else:
        with st.spinner("Generating summary..."):
            try:
                summary = generate_summary(text_input, tokenizer, model)
                st.subheader("Summary")
                st.success(summary)
            except Exception as e:
                st.error(f"An error occurred during generation: {e}")

# Sidebar info
st.sidebar.title("About")
st.sidebar.info(
    "This app uses a fine-tuned T5-Small Transformer model "
    "trained on the Amazon Fine Food Reviews dataset."
)
st.sidebar.markdown("---")
st.sidebar.markdown("Built with Streamlit & Transformers")
