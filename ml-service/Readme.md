# 🧠 ML Mapping Service (NAMASTE → ICD / TM2)

Backend service that lets users:

1. **Search** traditional diseases (Ayurveda / Siddha / Unani)
2. **Select** a specific entry
3. **Map** it to **ICD-11 / TM2** (top results)

---

## 🌐 Base URL

```
http://127.0.0.1:8000
```

## 📚 Interactive Docs (Swagger)

Open in browser:

```
http://127.0.0.1:8000/docs
```

---

# 🔑 Core Concepts (Frontend must know)

### 1) Two phases (DO NOT mix)

```
Search → user selects → Map
```

### 2) Pagination (Search only)

* `limit` = how many items to return (default 5)
* `offset` = how many items to skip (for “Load more”)

### 3) Mapping size

* `top_k` = number of mapping results to return (default 5)

### 4) Systems

```
ayurveda | siddha | unani | tm2 | icd11
```

> ⚠️ Mapping is only from **traditional → tm2/icd11** (no reverse mapping)

---

# 🧪 1) Health Check

### Endpoint

```
GET /health
```

### Use (Frontend)

* Optional (for status indicator)

### Response

```json
{ "status": "ok" }
```

---

# 🔍 2) Lookup (Code-based)

### Endpoint

```
GET /lookup/{system}/{code}
```

### Use (Frontend)

* When user enters a **known code** directly
* Show full details immediately

### Example

```
/lookup/ayurveda/AYU
/lookup/tm2/SK00
```

### Response

```json
{
  "code": "SK00",
  "title": "Cephalalgia disorder (TM2)",
  ...
}
```

---

# 🔎 3) Search (System-specific)

### Endpoint

```
GET /search/{system}?q=...&limit=5&offset=0
```

### Use (Frontend)

* When user selects a **system filter** (e.g., Ayurveda)
* Autocomplete / list results

### Example

```
/search/ayurveda?q=jvara
/search/tm2?q=headache
```

### Response

```json
{
  "results": [
    { "code": "AY001", "title": "..." }
  ],
  "has_more": true
}
```

---

# 🌍 4) Global Search (No system selected)

### Endpoint

```
GET /search?q=...&limit=5&offset=0
```

### Use (Frontend)

* When user does NOT select a system
* Show grouped results

### Response

```json
{
  "ayurveda": { "results": [...], "has_more": true },
  "siddha": { "results": [...], "has_more": false },
  "unani": { "results": [...], "has_more": true }
}
```

---

# 🔥 5) Mapping (MAIN API)

### Endpoint

```
POST /map
```

### Use (Frontend)

* After user selects a disease from search/lookup

### Request Body

```json
{
  "source_system": "ayurveda",
  "code": "AYU",
  "target": "both",
  "top_k": 5
}
```

### Params

| Field         | Description               |
| ------------- | ------------------------- |
| source_system | ayurveda / siddha / unani |
| code          | selected disease code     |
| target        | tm2 / icd11 / both        |
| top_k         | number of results         |

---

### Response

```json
{
  "source": {...},
  "tm2": [...],
  "icd11": [...]
}
```

---

# 🧠 Pagination (Frontend Logic)

## 🔹 First call

```
/search/tm2?q=headache
```

Returns first 5 results.

## 🔹 Load more

```
/search/tm2?q=headache&offset=5
```

## 🔹 Rule

```
Only call next offset if has_more = true
```

---

# 🎯 UI FLOW (IMPORTANT)

## Case 1: User knows code

```
Input: SK00
→ /lookup/tm2/SK00
→ Show details
→ Click "Map"
→ POST /map
```

---

## Case 2: User selects system

```
Select: Ayurveda
Search: jvara
→ /search/ayurveda?q=jvara
→ Show list
→ Select item
→ POST /map
```

---

## Case 3: General search

```
Search: headache
→ /search?q=headache
→ Show grouped results
→ Select item
→ POST /map
```

---

# ⚠️ Important Rules (Frontend)

### ❌ DO NOT:

* Call `/map` without selection
* Mix ICD results in search UI
* Ignore `has_more`

### ✅ ALWAYS:

* Show system label (Ayurveda/Siddha/Unani)
* Use `offset` for pagination
* Use `top_k` for mapping size

---

# 🧪 Minimal Test Flow

1. Open:

```
/docs
```

2. Test:

```
/health
/lookup/tm2/SK00
/search/tm2?q=headache
/search?q=headache
POST /map
```

---

# 🧾 One-line Summary

```
Search → Select → Map
offset = skip results
limit = results per page
top_k = mapping results
```

---

# 🚀 Future Improvements (optional)

* MongoDB Atlas Search (better search quality)
* Hybrid ranking (BM25 + ML)
* Caching mapping results

---

## 👨‍💻 Notes for Frontend Dev

* This API is **stateless**
* No authentication required (for now)
* All endpoints are **fast GET except /map (POST)**
* Swagger (`/docs`) is your best testing tool

---

✔ If anything feels unclear during integration, check Swagger first
✔ If still unclear, log request/response and debug with backend

---
