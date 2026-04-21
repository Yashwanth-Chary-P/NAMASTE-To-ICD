from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def rerank(query, docs, top_k=5):
    texts = [doc.get("ml_text", "") for doc in docs]

    if not texts:
        return []

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([query] + texts)

    scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    for i, doc in enumerate(docs):
        doc["score"] = float(scores[i])

    return sorted(docs, key=lambda x: x["score"], reverse=True)[:top_k]