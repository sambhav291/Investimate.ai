from dotenv import load_dotenv
import os

load_dotenv()

# NOTE: Paid API keys no longer used - project now uses free, local AI models
# openrouter_key = os.getenv("OPENROUTER_KEY")  # DEPRECATED - No longer used
# gemini_key = os.getenv("GEMINI_KEY")  # DEPRECATED - No longer used
# gemini_key2 = os.getenv("GEMINI_KEY2")  # DEPRECATED - No longer used

# Free/Local AI configuration - using CPU-only models
FREE_AI_ENABLED = True
LOCAL_MODELS_ONLY = True



