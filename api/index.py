import sys
import os

# Add parent directory to sys.path so 'backend' package imports work cleanly on Vercel
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
