from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.fhir_service import build_fhir_record, save_fhir_record

router = APIRouter()


class FHIRStoreRequest(BaseModel):
    source_system: str
    target_system: str
    source_doc: Dict[str, Any] = Field(..., description="Selected traditional document")
    target_doc: Dict[str, Any] = Field(..., description="Selected TM2 or ICD-11 document")
    tag: str = "Equivalent"
    score: float = 0.0


@router.post("/fhir/store")
def store_selected_mapping(req: FHIRStoreRequest):
    try:
        record = build_fhir_record(
            source_system=req.source_system,
            target_system=req.target_system,
            source_doc=req.source_doc,
            target_doc=req.target_doc,
            tag=req.tag,
            score=req.score,
        )
        mapping_key = save_fhir_record(record)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "message": "Selected mapping stored successfully",
        "mappingKey": mapping_key,
        "record": record,
    }