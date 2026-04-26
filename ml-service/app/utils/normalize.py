import re
import unicodedata


def normalize_text(text):
    if text is None:
        return ""
    text = str(text).lower()
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def unique_keep_order(items):
    seen = set()
    out = []
    for item in items:
        if item and item not in seen:
            seen.add(item)
            out.append(item)
    return out


def highlight_text(text, terms):
    if not text:
        return ""

    if isinstance(terms, str):
        terms = [terms]

    result = str(text)
    clean_terms = unique_keep_order([str(t).strip() for t in terms if str(t).strip()])
    clean_terms.sort(key=len, reverse=True)

    for term in clean_terms:
        pattern = re.compile(re.escape(term), re.IGNORECASE)
        result = pattern.sub(lambda m: f"<mark>{m.group(0)}</mark>", result)

    return result