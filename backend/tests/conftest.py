import pytest_asyncio

from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool
from typing import AsyncGenerator

from app.main import app
from app.database import get_db
from app.config import settings


@pytest_asyncio.fixture()
async def client(db_session_factory: async_sessionmaker) -> AsyncGenerator:
    async def override_get_db():
        async with db_session_factory() as db_session:
            yield db_session

    app.dependency_overrides[get_db] = override_get_db
    yield AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost")
    app.dependency_overrides.clear()


@pytest_asyncio.fixture()
async def db_session(db_session_factory: async_sessionmaker) -> AsyncGenerator:
    async with db_session_factory() as db_session:
        yield db_session


@pytest_asyncio.fixture()
async def db_session_factory() -> AsyncGenerator:
    async with async_engine.connect() as connection:
        transaction = await connection.begin()

        try:
            yield async_sessionmaker(
                bind=connection,
                class_=AsyncSession,
                expire_on_commit=False,
                autocommit=False,
                autoflush=False,
                join_transaction_mode="create_savepoint",
            )
        finally:
            await transaction.rollback()


async_engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
