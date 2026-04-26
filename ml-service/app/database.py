from pymongo import MongoClient
from app.config import MONGO_URI, DB_NAME

_client = None
_db = None


def connect_db():
    global _client, _db

    if _db is not None:
        return _db

    if not MONGO_URI:
        raise RuntimeError("MONGO_URI is missing in .env")

    print("\nConnecting to MongoDB...")
    _client = MongoClient(MONGO_URI)
    _client.admin.command("ping")
    _db = _client[DB_NAME]

    print("MongoDB connected successfully")
    print(f"Database: {DB_NAME}")
    print(f"Collections: {_db.list_collection_names()}")
    print("--------------------------------------------------\n")

    return _db


def get_db():
    if _db is None:
        raise RuntimeError("Database not connected. Call connect_db() first.")
    return _db


def get_collection(collection_name: str):
    return get_db()[collection_name]