from fastapi import FastAPI
from app.database import connect_db
from app.routes.health import router as health_router
from app.routes.map import router as map_router

app = FastAPI(title="NAMASTE ML Service")


@app.on_event("startup")
async def startup_event():
    connect_db()


app.include_router(health_router)
app.include_router(map_router)