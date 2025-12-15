from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from ..database import get_db


router = APIRouter()


@router.get(
    path="/health",
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
async def health_check(
    db: Annotated[AsyncSession, Depends(get_db)],
    response: Response,
):
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not available",
        ) from e

    response.headers["Cache-Control"] = "no-store"

    return {"status": "ok"}
