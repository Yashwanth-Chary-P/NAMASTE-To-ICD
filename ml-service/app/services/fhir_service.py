from datetime import datetime, timezone
from typing import Any, Dict

from app.database import get_collection
from app.config import COLLECTIONS


FHIR_EQUIVALENCE_MAP = {
    "Equivalent": "equal",
    "Narrower": "narrower",
    "Related": "relatedto",
    "Weak": "unmatched",
}


def _first_nonempty(doc: Dict[str, Any], keys: list[str]) -> str:
    for key in keys:
        value = doc.get(key)
        if value not in [None, "", [], {}]:
            if isinstance(value, list):
                joined = " ".join(str(v) for v in value if v not in [None, ""])
                if joined.strip():
                    return joined.strip()
            elif isinstance(value, dict):
                joined = " ".join(str(v) for v in value.values() if v not in [None, ""])
                if joined.strip():
                    return joined.strip()
            else:
                text = str(value).strip()
                if text:
                    return text
    return ""


def _extract_code(doc: Dict[str, Any], preferred_keys: list[str]) -> str:
    code = _first_nonempty(doc, preferred_keys)
    if not code:
        raise ValueError("Code not found in provided document")
    return code


def _extract_display(doc: Dict[str, Any]) -> str:
    return _first_nonempty(
        doc,
        [
            "title",
            "original_title",
            "display_name",
            "Name English",
            "NAMC_term_diacritical",
            "NAMC_term",
            "NUMC_TERM",
            "term",
        ],
    )


def build_fhir_record(
    source_system: str,
    target_system: str,
    source_doc: Dict[str, Any],
    target_doc: Dict[str, Any],
    tag: str = "Equivalent",
    score: float = 0.0,
) -> Dict[str, Any]:
    source_system = (source_system or "").lower().strip()
    target_system = (target_system or "").lower().strip()

    source_code = _extract_code(
        source_doc,
        ["NAMC_CODE", "NUMC_CODE", "code", "Code"],
    )
    target_code = _extract_code(
        target_doc,
        ["code", "Code", "NAMC_CODE", "NUMC_CODE"],
    )

    source_display = _extract_display(source_doc) or source_code
    target_display = _extract_display(target_doc) or target_code

    equivalence = FHIR_EQUIVALENCE_MAP.get(tag, "unmatched")

    mapping_key = f"{source_system}:{source_code}:{target_system}:{target_code}"

    return {
        "resourceType": "ConceptMap",
        "mappingKey": mapping_key,
        "status": "active",
        "date": datetime.now(timezone.utc).isoformat(),
        "sourceSystem": source_system,
        "targetSystem": target_system,
        "sourceDocument": source_doc,
        "targetDocument": target_doc,
        "group": [
            {
                "source": source_system,
                "target": target_system,
                "element": [
                    {
                        "code": source_code,
                        "display": source_display,
                        "target": [
                            {
                                "code": target_code,
                                "display": target_display,
                                "equivalence": equivalence,
                                "extension": [
                                    {
                                        "url": "urn:namaste-to-icd:score",
                                        "valueDecimal": float(score),
                                    },
                                    {
                                        "url": "urn:namaste-to-icd:tag",
                                        "valueCode": tag,
                                    },
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
    }


def save_fhir_record(record: Dict[str, Any]) -> str:
    collection = get_collection(COLLECTIONS["fhir_mappings"])

    mapping_key = record.get("mappingKey")
    if not mapping_key:
        raise ValueError("mappingKey is missing")

    collection.update_one(
        {"mappingKey": mapping_key},
        {"$set": record},
        upsert=True,
    )

    return mapping_key