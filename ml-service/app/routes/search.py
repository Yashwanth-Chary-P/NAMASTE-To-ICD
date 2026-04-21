from fastapi import APIRouter
from app.services.search_service import search_in_collection
from app.config import COLLECTIONS

router = APIRouter()


@router.get("/search/{system}")
def search_system(system: str, q: str, limit: int = 5, offset: int = 0):
    if system not in COLLECTIONS:
        return {"error": "Invalid system"}

    return search_in_collection(system, q, limit, offset)


@router.get("/search")
def search_all(q: str, limit: int = 5, offset: int = 0):
    systems = ["ayurveda", "siddha", "unani"]

    return {
        system: search_in_collection(system, q, limit, offset)
        for system in systems
    }