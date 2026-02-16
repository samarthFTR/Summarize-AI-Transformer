import sys
import os

# Ensure the project root is in the python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.training.train import train

if __name__ == "__main__":
    print("=" * 60)
    print("  GPT-2 Text Generator — Fine-Tuning Pipeline")
    print("  Task: Summary → Full Text Generation")
    print("=" * 60)
    print()
    train()
