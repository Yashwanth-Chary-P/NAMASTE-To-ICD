def get_code_field(system):
    return {
        "ayurveda": "NAMC_CODE",
        "siddha": "NAMC_CODE",
        "unani": "NUMC_CODE",
        "tm2": "code",
        "icd11": "code"
    }.get(system, "code")


def get_text_fields(system):
    return {
        "ayurveda": ["NAMC_term", "Name English", "query"],
        "siddha": ["NAMC_TERM", "Short_definition", "query"],
        "unani": ["NUMC_TERM", "Short_definition", "query"],
        "tm2": ["title", "search_text"],
        "icd11": ["title", "search_text"]
    }.get(system, ["search_text"])