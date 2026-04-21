from app.database import get_collection
from app.config import COLLECTIONS
from app.services.ranking_service import rerank
from app.utils.schema_utils import get_code_field

DEFAULT_TOP_K = 5


def build_query(doc):
    return " ".join([
        str(doc.get("title", "")),
        str(doc.get("NAMC_term", "")),
        str(doc.get("NUMC_TERM", "")),
        str(doc.get("Name English", "")),
        str(doc.get("Short_definition", "")),
        str(doc.get("Long_definition", "")),
        str(doc.get("query", "")),
        str(doc.get("ml_text", ""))
    ])


def map_to_targets(source_system, code, target="both", top_k=DEFAULT_TOP_K):

    col = get_collection(COLLECTIONS[source_system])
    code_field = get_code_field(source_system)

    doc = col.find_one(
        {code_field: {"$regex": f"^{code}$", "$options": "i"}},
        {"_id": 0}
    )

    if not doc:
        return None

    query = build_query(doc)

    results = {}

    if target in ["tm2", "both"]:
        tm2_docs = list(get_collection("tm2").find({}, {"_id": 0}).limit(1000))
        results["tm2"] = rerank(query, tm2_docs, top_k)

    if target in ["icd11", "both"]:
        icd_docs = list(get_collection("icd_codes").find({}, {"_id": 0}).limit(1000))
        results["icd11"] = rerank(query, icd_docs, top_k)

    return {
        "source": doc,
        **results
    }