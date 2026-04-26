def get_code_field(system: str):
    system = (system or "").lower()
    return {
        "ayurveda": "NAMC_CODE",
        "siddha": "NAMC_CODE",
        "unani": "NUMC_CODE",
        "tm2": "code",
        "icd11": "code",
    }.get(system, "code")


def first_nonempty(doc: dict, keys: list[str]) -> str:
    for key in keys:
        value = doc.get(key)
        if value not in [None, "", [], {}]:
            return str(value).strip()
    return ""


def get_display_fields(system: str):
    system = (system or "").lower()
    return {
        "ayurveda": [
            "NAMC_term_diacritical",
            "NAMC_term",
            "Name English",
            "Short_definition",
            "Long_definition",
            "query",
        ],
        "siddha": [
            "NAMC_term_diacritical",
            "NAMC_term",
            "Name English",
            "Short_definition",
            "Long_definition",
            "query",
        ],
        "unani": [
            "NUMC_TERM",
            "NUMC_term",
            "Name English",
            "Short_definition",
            "Long_definition",
            "query",
        ],
        "tm2": ["title", "ml_text", "search_text"],
        "icd11": ["title", "ml_text", "search_text"],
    }.get(system, ["title", "search_text", "ml_text"])