from fastapi import FastAPI

from app.routes import health, lookup, search, map, fhir

app = FastAPI(title="ML Mapping Service")

app.include_router(health.router)
app.include_router(lookup.router)
app.include_router(search.router)
app.include_router(map.router)
app.include_router(fhir.router)