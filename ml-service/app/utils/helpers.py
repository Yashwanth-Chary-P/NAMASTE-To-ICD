def looks_like_code(q):
    return any(char.isdigit() for char in q)