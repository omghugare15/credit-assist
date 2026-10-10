import os
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")

# On Vercel, root filesystem is read-only, so SQLite must reside in /tmp unless Postgres/Supabase is provided
if os.getenv("VERCEL"):
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/credit_assistant.db")
else:
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./credit_assistant.db")
