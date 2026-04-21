from fastapi import APIRouter, HTTPException
from app.database import get_collection
from app.config import COLLECTIONS
from app.utils.schema_utils import get_code_field

router = APIRouter()


@router.get("/lookup/{system}/{code}")
def lookup(system: str, code: str):

    if system not in COLLECTIONS:
        raise HTTPException(400, "Invalid system")

    col = get_collection(COLLECTIONS[system])
    field = get_code_field(system)

    doc = col.find_one(
        {field: {"$regex": f"^{code}$", "$options": "i"}},
        {"_id": 0}
    )

    if not doc:
        raise HTTPException(404, "Code not found")

    return doc