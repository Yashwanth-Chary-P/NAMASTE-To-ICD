from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import health, lookup, search, map, fhir

app = FastAPI(title="ML Mapping Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Allow your React dev server
    allow_credentials=True,
    allow_methods=["*"], # Allow GET, POST, etc.
    allow_headers=["*"], # Allow all headers
)
app.include_router(health.router)
app.include_router(lookup.router)
app.include_router(search.router)
app.include_router(map.router)
app.include_router(fhir.router)