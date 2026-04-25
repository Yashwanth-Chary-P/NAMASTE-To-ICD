# 🧠 NAMASTE → ICD Backend

This is the **Node.js (Express) backend API gateway** for the NAMASTE-to-ICD mapping system.

It handles:
- 🔍 Search & lookup
- 🧠 Communication with ML service (FastAPI)
- 💾 Storing user-confirmed mappings (FHIR format)

---

## 🚀 Architecture

Frontend → Backend (Node.js) → ML Service (FastAPI) → MongoDB

---

## 📂 Features

- System-wise search (Ayurveda, Siddha, Unani, TM2, ICD-11)
- Global search across traditional systems
- Mapping via ML service
- FHIR-based storage of selected mappings
- Pagination support (limit + offset)

---

## ⚙️ Setup

### 1. Install dependencies

```bash
npm install