"""
Upload trained model weights to Hugging Face Hub.

Usage:
    1. pip install huggingface_hub
    2. huggingface-cli login   (paste your HF access token)
    3. Create repos manually on https://huggingface.co/new :
       - samarthFTR/summarize-ai-t5
       - samarthFTR/summarize-ai-gpt2
    4. python upload_models.py
"""

import os
from huggingface_hub import HfApi

# ─── Configuration ───────────────────────────────────────────────
HF_USERNAME = "samarthFTR"

MODELS = [
    {
        "local_path": os.path.join("summarization", "models", "t5-small"),
        "repo_id": f"{HF_USERNAME}/summarize-ai-t5",
    },
    {
        "local_path": os.path.join("text_generator", "models", "gpt2-finetuned"),
        "repo_id": f"{HF_USERNAME}/summarize-ai-gpt2",
    },
]


def upload_model(local_path, repo_id):
    """Upload a single model to an existing HuggingFace Hub repo."""
    api = HfApi()

    print(f"\n{'='*60}")
    print(f"📦 Uploading: {repo_id}")
    print(f"   From: {os.path.abspath(local_path)}")
    print(f"{'='*60}")

    # List files that will be uploaded
    for root, dirs, files in os.walk(local_path):
        # Skip checkpoint directories
        dirs[:] = [d for d in dirs if not d.startswith("checkpoint-")]
        for f in files:
            if f == "training_args.bin":
                continue
            full = os.path.join(root, f)
            size_mb = os.path.getsize(full) / (1024 * 1024)
            rel = os.path.relpath(full, local_path)
            print(f"   📁 {rel} ({size_mb:.1f} MB)")

    print(f"\n⬆️  Uploading to https://huggingface.co/{repo_id} ...")

    api.upload_folder(
        folder_path=local_path,
        repo_id=repo_id,
        repo_type="model",
        ignore_patterns=["checkpoint-*", "training_args.bin"],
    )

    print(f"✅ Upload complete! View at: https://huggingface.co/{repo_id}")


def main():
    print("🤗 Hugging Face Model Uploader")
    print("=" * 60)

    for model_info in MODELS:
        local_path = model_info["local_path"]

        if not os.path.exists(local_path):
            print(f"\n❌ Model directory not found: {local_path}")
            print("   Make sure you've trained the model first!")
            continue

        upload_model(
            local_path=local_path,
            repo_id=model_info["repo_id"],
        )

    print(f"\n{'='*60}")
    print("🎉 All uploads complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("  1. Verify models at https://huggingface.co/samarthFTR")
    print("  2. Push code to GitHub")
    print("  3. Deploy to Render + Vercel")


if __name__ == "__main__":
    main()
