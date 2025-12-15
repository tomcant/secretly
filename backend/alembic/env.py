import asyncio

from alembic import context
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import create_async_engine

from app.config import settings
from app.models.secret import Base


def run_migrations_offline() -> None:
    context.configure(
        url=settings.DATABASE_URL,
        target_metadata=Base.metadata,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    engine = create_async_engine(settings.DATABASE_URL)

    async def run_async_migrations() -> None:
        async with engine.begin() as connection:
            await connection.run_sync(run_migrations_sync)
        await engine.dispose()

    def run_migrations_sync(connection: Connection) -> None:
        context.configure(
            connection=connection,
            target_metadata=Base.metadata,
        )
        with context.begin_transaction():
            context.run_migrations()

    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
