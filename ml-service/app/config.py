import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB Config
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "medical_mapping")

# Collections
COLLECTIONS = {
    "ayurveda": "traditional_ayurveda",
    "siddha": "traditional_siddha",
    "unani": "traditional_unani",
    "tm2": "tm2",
    "icd11": "icd_codes"
}

# Validation (fail fast if missing)
if not MONGO_URI:
    raise ValueError("❌ MONGO_URI is not set in .env")