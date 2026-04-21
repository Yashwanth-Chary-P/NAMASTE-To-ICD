from app.database import get_collection
from app.config import COLLECTIONS
from app.utils.text_utils import normalize_text
from app.utils.schema_utils import get_text_fields

DEFAULT_LIMIT = 5

def search_in_collection(system, query, limit=DEFAULT_LIMIT, offset=0):
    col = get_collection(COLLECTIONS[system])

    query = normalize_text(query)
    fields = get_text_fields(system)

    regex_query = {
        "$or": [
            {field: {"$regex": query, "$options": "i"}}
            for field in fields
        ]
    }

    cursor = col.find(regex_query, {"_id": 0}).skip(offset).limit(limit)
    results = list(cursor)

    return {
        "results": results,
        "has_more": len(results) == limit
    }