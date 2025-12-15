import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from .config import settings
from .routers import health, secrets


is_prod = settings.APP_ENV == "prod"

app = FastAPI(
    title="Secretly API",
    description="A secure API for sharing secrets",
    version="0.1.0",
    docs_url="/docs" if not is_prod else None,
    redoc_url="/redoc" if not is_prod else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ALLOWED_ORIGIN],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(secrets.router)
app.include_router(health.router)

handler = Mangum(app)

if settings.APP_ENV == "prod":
    asyncio.set_event_loop(asyncio.new_event_loop())
