from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.utils.normalize import normalize_text, highlight_text
from app.utils.schema_utils import first_nonempty


def assign_tag(score, exact=False):
    if exact and score > 0.60:
        return "Equivalent"
    if score >= 0.80:
        return "Equivalent"
    elif score >= 0.60:
        return "Narrower"
    elif score >= 0.40:
        return "Related"
    return "Weak"


def get_confidence(score):
    if score > 0.8:
        return "high"
    elif score > 0.5:
        return "medium"
    return "low"


def _display_text(doc: dict):
    return first_nonempty(
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


def rerank(query, docs, field="ml_text", top_k=5):
    if not docs:
        return []

    texts = []
    for doc in docs:
        text = doc.get(field) or doc.get("search_text") or doc.get("title") or doc.get("original_title") or ""
        texts.append(str(text))

    try:
        vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=50000)
        vectors = vectorizer.fit_transform([query] + texts)
        scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()
    except ValueError:
        scores = [0.0 for _ in docs]

    q_norm = normalize_text(query)
    results = []

    for doc, base_score in zip(docs, scores):
        doc_copy = dict(doc)

        candidate_text = (
            doc.get(field)
            or doc.get("search_text")
            or doc.get("title")
            or doc.get("original_title")
            or ""
        )
        candidate_text = str(candidate_text)
        candidate_norm = normalize_text(candidate_text)

        exact = bool(q_norm and q_norm in candidate_norm)

        matched_terms = []
        for term in q_norm.split():
            if len(term) >= 2 and term in candidate_norm:
                matched_terms.append(term)

        boost = 0.25 if exact else min(0.25, 0.05 * len(matched_terms))
        final_score = min(1.0, float(base_score) + boost)

        tag = assign_tag(final_score, exact=exact)
        confidence = get_confidence(final_score)

        if matched_terms:
            match_reason = f"Matched keywords: {', '.join(matched_terms[:8])}"
        elif exact:
            match_reason = "Exact text match found"
        else:
            match_reason = "Weighted TF-IDF similarity"

        display = _display_text(doc_copy)

        doc_copy["score"] = round(final_score, 6)
        doc_copy["tag"] = tag
        doc_copy["confidence"] = confidence
        doc_copy["exact_match"] = exact
        doc_copy["matched_terms"] = matched_terms
        doc_copy["match_reason"] = match_reason
        doc_copy["highlighted_title"] = highlight_text(display, [query] + matched_terms)
        doc_copy["highlighted_text"] = highlight_text(candidate_text, [query] + matched_terms)

        results.append(doc_copy)

    results = sorted(results, key=lambda x: x["score"], reverse=True)

    for idx, doc in enumerate(results, start=1):
        doc["rank"] = idx

    return results[:top_k]