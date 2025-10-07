# NAMASTE ↔ ICD-11 Mapping (Backend + Frontend)

A full-stack project to search NAMASTE (AYUSH) codes across Ayurveda, Siddha, and Unani, and map them to WHO ICD‑11 entities.

## Features
- Search NAMASTE datasets (Ayurvedha, Siddha, Unani)
- Combined search across systems + ICD-11 lookup
- Direct ICD endpoints: token generation and entity search
- React frontend with an ICD search box (demo)

## Monorepo Layout
```
NAMASTE-To-ICD/
  Backend/
    src/
      app.js           # Express app and route mounting
      server.js        # Bootstraps server
      config/db.js     # Mongo connection
      controllers/     # Siddha, Ayurvedha, Unani, Search controllers
      routes/          # /api/* routes (icd, search, siddha, ayurvedha, unani)
      models/          # Mongoose schemas and text indexes
      services/        # icdAuthService (OAuth) & icdService (fetch/aggregate)
    package.json
    .env               # see Environment section

  Frontend/
    src/
      Components/ICD_Searchbox.jsx  # Demo ICD search UI
    package.json
```

## Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)
- WHO ICD API client credentials (CLIENT_ID, CLIENT_SECRET)

## Setup
### 1) Clone
```bash
git clone <your-repo-url>
cd NAMASTE-To-ICD
```

### 2) Backend
```bash
cd Backend
npm install
```
Create `.env` in `Backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/namaste   # or your Atlas URI
CLIENT_ID=YOUR_WHO_ICD_CLIENT_ID
CLIENT_SECRET=YOUR_WHO_ICD_CLIENT_SECRET
```
Run:
```bash
npm run dev
```
The server starts on http://localhost:5000

### 3) Frontend
```bash
cd ../Frontend
npm install
npm run dev
```
The app starts on the Vite dev server (shown in terminal).

## Backend Endpoints
Base URL: `http://localhost:5000`

- ICD utility
  - `POST /api/icd/token` → returns WHO ICD access token
  - `GET /api/icd/search/:term` (requires `Authorization: Bearer <token>`) → detailed entities

- Combined NAMASTE search
  - `GET /api/search?q=<term>` → searches Ayurveda, Siddha, Unani + single ICD result
  - `GET /api/search/namaste/:code` → fetch NAMASTE doc by code and ICD matches

- Ayurvedha
  - `GET /api/ayurvedha/search?q=<term>`
  - `GET /api/ayurvedha/:code`

- Siddha
  - `GET /api/siddha/search?q=<term>`
  - `GET /api/siddha/:code`

- Unani
  - `GET /api/unani/search?q=<term>`
  - `GET /api/unani/:code`

Notes:
- Local searches use text indexes with regex fallback.
- ICD integration calls WHO ICD v2 with release path `11/2025-01/mms` and falls back to `/unspecified` when needed.

## Frontend (ICD Demo)
`Frontend/src/Components/ICD_Searchbox.jsx` demonstrates:
- Fetch token from backend (`POST /api/icd/token`)
- Search entities (`GET /api/icd/search/:term`) with `Authorization` header
- Toggle to show/hide definitions

Update `Base_Url` if your backend host/port differs.

## Development Scripts
- Backend: `npm run dev` (nodemon), `npm start` (same)
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## Troubleshooting
- 401 on ICD search: ensure you first obtain a token and send `Authorization: Bearer <token>`
- Mongo connection error: verify `MONGO_URI` and that MongoDB is reachable
- No ICD code returned for an entity: service will attempt `/unspecified` fallback

## License
MIT

## Acknowledgements
- Ministry of AYUSH (India)
- WHO ICD-11 API


 
