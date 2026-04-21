from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.mapping_service import map_to_targets

router = APIRouter()


class MapRequest(BaseModel):
    source_system: str
    code: str
    target: str = "both"
    top_k: int = 5


@router.post("/map")
def map_api(req: MapRequest):

    result = map_to_targets(
        req.source_system,
        req.code,
        req.target,
        req.top_k
    )

    if not result:
        raise HTTPException(404, "Source not found")

    return result