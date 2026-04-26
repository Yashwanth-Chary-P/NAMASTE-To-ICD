import os
from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT", "8000"))
MONGO_URI = os.getenv("MONGO_URI", "")
DB_NAME = os.getenv("DB_NAME", "medical_mapping")
CANDIDATE_LIMIT = int(os.getenv("CANDIDATE_LIMIT", "1000"))
DEFAULT_TOP_K = int(os.getenv("DEFAULT_TOP_K", "5"))

COLLECTIONS = {
    "ayurveda": "traditional_ayurveda",
    "siddha": "traditional_siddha",
    "unani": "traditional_unani",
    "tm2": "tm2",
    "icd11": "icd_codes",
}