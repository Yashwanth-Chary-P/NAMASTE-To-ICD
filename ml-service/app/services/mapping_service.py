import re

from app.config import COLLECTIONS, CANDIDATE_LIMIT, DEFAULT_TOP_K
from app.database import get_collection
from app.services.cache_service import make_cache_key, get_cached_mapping, set_cached_mapping
from app.services.ranking_service import rerank
from app.utils.schema_utils import get_code_field, first_nonempty


def _repeat_text(text, times):
    text = str(text or "").strip()
    if not text:
        return ""
    return ((text + " ") * times).strip()


def build_query(doc):
    title = first_nonempty(
        doc,
        [
            "title",
            "Name English",
            "NAMC_term_diacritical",
            "NAMC_term",
            "NUMC_TERM",
            "display_name",
            "term",
        ],
    )

    fsn = first_nonempty(
        doc,
        [
            "fsn",
            "Fully Specified Name",
            "Short_definition",
            "short_definition",
        ],
    )

    index_terms = first_nonempty(
        doc,
        [
            "Index Terms",
            "index_terms",
            "index_terms_original",
            "query",
        ],
    )

    inclusions = first_nonempty(doc, ["Inclusions", "inclusions"])
    definition = first_nonempty(doc, ["Description", "description", "Long_definition", "long_definition"])

    parts = []

    if title:
        parts.append(_repeat_text(title, 4))
    if fsn and fsn != title:
        parts.append(_repeat_text(fsn, 2))
    if index_terms:
        parts.append(_repeat_text(index_terms, 3))
    if inclusions:
        parts.append(_repeat_text(inclusions, 2))
    if definition:
        parts.append(_repeat_text(definition, 1))

    if not parts:
        fallback = first_nonempty(doc, ["ml_text", "search_text", "query", "title"])
        parts.append(fallback)

    return " ".join(parts).strip()[:12000]


def _fetch_source_doc(source_system, code):
    collection_name = COLLECTIONS.get(source_system)
    if not collection_name:
        raise ValueError("Invalid source_system")

    col = get_collection(collection_name)
    code_field = get_code_field(source_system)

    return col.find_one(
        {code_field: {"$regex": re.escape(code), "$options": "i"}},
        {"_id": 0},
    )


def _fetch_candidates(target_system):
    collection_name = COLLECTIONS.get(target_system)
    if not collection_name:
        return []

    col = get_collection(collection_name)
    return list(col.find({}, {"_id": 0}).limit(CANDIDATE_LIMIT))


def map_to_targets(source_system, code, target="both", top_k=DEFAULT_TOP_K):
    source_system = (source_system or "").lower()
    target = (target or "both").lower()
    top_k = int(top_k or DEFAULT_TOP_K)

    cache_key = make_cache_key(source_system, code, target, top_k)
    cached = get_cached_mapping(cache_key)
    if cached:
        cached["cache_hit"] = True
        return cached

    source_doc = _fetch_source_doc(source_system, code)
    if not source_doc:
        return None

    query = build_query(source_doc)

    response = {
        "source_system": source_system,
        "target": target,
        "code": code,
        "query": query,
        "source": source_doc,
        "cache_hit": False,
    }

    if target in ["tm2", "both"]:
        tm2_candidates = _fetch_candidates("tm2")
        response["tm2"] = rerank(query, tm2_candidates, top_k=top_k)

    if target in ["icd11", "both"]:
        icd_candidates = _fetch_candidates("icd11")
        response["icd11"] = rerank(query, icd_candidates, top_k=top_k)

    set_cached_mapping(cache_key, response)
    return response