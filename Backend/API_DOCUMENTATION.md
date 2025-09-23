Here’s a **rewritten, project-specific Markdown documentation** for your NAMASTE-to-ICD API, formatted in a clean, code-centric way for a `.md` file:

```markdown
# 🔧 NAMASTE-To-ICD API Documentation

## 🚀 Overview

This API allows searching **NAMASTE codes** across **Siddha, Ayurvedha, and Unani** systems and mapping them to **ICD-11** entities from WHO. It supports:

- Search by **term** or **code**
- Returns local NAMASTE data + ICD mapping
- Advanced search using **short definitions** for ICD queries

---

## 📂 Folder Structure

```

project-root/
│
├─ src/
│   ├─ models/
│   │   ├─ SiddhaCode.js
│   │   ├─ AyurvedhaCode.js
│   │   └─ UnaniCode.js
│   │
│   ├─ controllers/
│   │   ├─ siddhaController.js
│   │   ├─ ayurvedhaController.js
│   │   └─ unaniController.js
│   │
│   ├─ routes/
│   │   ├─ siddhaRoutes.js
│   │   ├─ ayurvedhaRoutes.js
│   │   └─ unaniRoutes.js
│   │
│   ├─ services/
│   │   └─ icdService.js
│   │
│   └─ config/
│       └─ db.js
│
├─ server.js
├─ package.json
└─ .env

````

---

## 🌐 API Endpoints

### 1. **Siddha**

#### Search by term
```http
GET /api/siddha/search?q=term
````

**Response**

```json
{
  "query": "term",
  "siddha": [...local results...],
  "localCount": 3,
  "icd": [...ICD results...],
  "method": "advanced"
}
```

#### Get by code

```http
GET /api/siddha/:code
```

**Response**

```json
{
  "siddha": { ...document... },
  "icd": [...ICD results...]
}
```

---

### 2. **Ayurvedha**

#### Search by term

```http
GET /api/ayurvedha/search?q=term
```

#### Get by code

```http
GET /api/ayurvedha/:code
```

> ICD search keywords are derived from the `Short_definition` field.

---

### 3. **Unani**

#### Search by term

```http
GET /api/unani/search?q=term
```

#### Get by code

```http
GET /api/unani/:code
```

> ICD search keywords are derived from the `short_definition` field.

---

## 🔐 Authentication for ICD API

* Uses **OAuth 2.0**
* Environment variables:

```env
CLIENT_ID=YOUR_CLIENT_ID
CLIENT_SECRET=YOUR_CLIENT_SECRET
```

* Generate token (internal endpoint):

```http
POST /api/icd/token
```

**Response**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs...",
  "message": "Token generated successfully"
}
```

---

## 🔄 How ICD Integration Works

1. Search local MongoDB first using **text index** or **regex fallback**.
2. Extract keywords from **short\_definition** for ICD API.
3. Call WHO ICD API for each keyword.
4. Return combined response:

```json
{
  "query": "term",
  "siddha|ayurvedha|unani": [...local results...],
  "icd": [...ICD results...],
  "method": "advanced"
}
```

---

## 🛠️ Setup Requirements

### Environment Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/database

CLIENT_ID=YOUR_CLIENT_ID
CLIENT_SECRET=YOUR_CLIENT_SECRET
```

### Dependencies

```json
{
  "axios": "^1.6.0",
  "node-fetch": "^3.3.2",
  "mongoose": "^8.18.1",
  "express": "^5.1.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.2"
}
```

---

## 💻 Usage Examples

### Search across a system

```bash
curl "http://localhost:5000/api/siddha/search?q=fever"
curl "http://localhost:5000/api/ayurvedha/search?q=diabetes"
curl "http://localhost:5000/api/unani/search?q=headache"
```

### Search by code

```bash
curl "http://localhost:5000/api/siddha/AAA1.1"
curl "http://localhost:5000/api/ayurvedha/AYU"
curl "http://localhost:5000/api/unani/A-1"
```

### Generate ICD token (optional direct endpoint)

```bash
curl -X POST "http://localhost:5000/api/icd/token"
```

---

## ⚡ Key Features

* **Full-text search** across NAMASTE codes
* **ICD-11 integration** using `short_definition` keywords
* **Fallback regex search** if text index fails
* **Separate routes** per system: Siddha, Ayurvedha, Unani
* **Structured JSON response** with local and ICD results

---

## ✅ Notes

* Seed sample datasets are in `db.js` (Siddha, Ayurvedha, Unani).
* Controllers are modular for each system.
* ICD search is currently **live** per request; caching can be added.
* The API is **scalable** for additional AYUSH systems in the future.

```

---

If you want, I can also **add a “combined search” endpoint** documentation that searches **all three systems in one request**, so the `.md` becomes a single unified API doc.  

Do you want me to add that next?
```
