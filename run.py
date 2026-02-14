import sys
import os

# Ensure the project root is in the python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.training.train import train

if __name__ == "__main__":
    print("Starting Training Pipeline...")
    train()
