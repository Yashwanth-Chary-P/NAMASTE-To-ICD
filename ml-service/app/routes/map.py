from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.mapping_service import map_to_targets

router = APIRouter()


class MapRequest(BaseModel):
    source_system: str = Field(..., description="ayurveda / siddha / unani")
    code: str = Field(..., description="Selected source code")
    target: str = Field("both", description="tm2 / icd11 / both")
    top_k: int = Field(5, description="How many ranked results to return")


@router.post("/map")
def map_api(req: MapRequest):
    try:
        result = map_to_targets(
            req.source_system,
            req.code,
            req.target,
            req.top_k,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not result:
        raise HTTPException(status_code=404, detail="Source not found")

    return result