import base64
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from nanoid import generate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError

from ..database import get_db
from ..models.secret import Secret
from .schemas.secrets import (
    CreateSecretRequest,
    CreateSecretResponse,
    GetSecretResponse,
)


router = APIRouter(prefix="/secrets")


@router.post(
    path="",
    response_model=CreateSecretResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a secret",
)
async def create_secret(
    db: Annotated[AsyncSession, Depends(get_db)],
    create_secret_request: CreateSecretRequest,
    response: Response,
) -> CreateSecretResponse:
    ciphertext = base64.b64decode(create_secret_request.ciphertext, validate=True)
    iv = base64.b64decode(create_secret_request.iv, validate=True)

    secret_id = generate()
    secret = Secret(
        id=secret_id,
        ciphertext=ciphertext,
        iv=iv,
        views_remaining=1,
    )

    try:
        db.add(secret)
        await db.commit()
    except SQLAlchemyError as e:
        await db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create secret",
        ) from e

    response.headers["Cache-Control"] = "no-store"

    return CreateSecretResponse(id=secret_id)


@router.get(
    path="/{secret_id}",
    response_model=GetSecretResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve a secret",
)
async def get_secret(
    db: Annotated[AsyncSession, Depends(get_db)],
    secret_id: str,
    response: Response,
) -> GetSecretResponse:
    try:
        async with db.begin():
            result = await db.execute(
                select(Secret).where(Secret.id == secret_id).with_for_update()
            )
            secret = result.scalar_one_or_none()

            if (
                not secret
                or secret.views_remaining <= 0
                or secret.expires_at <= datetime.now(timezone.utc)
            ):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Secret not found",
                )

            secret.views_remaining -= 1

            # Transaction commits automatically when exiting the context

        ciphertext_b64 = base64.b64encode(secret.ciphertext).decode("utf-8")
        iv_b64 = base64.b64encode(secret.iv).decode("utf-8")

        response.headers["Cache-Control"] = "no-store"

        return GetSecretResponse(ciphertext=ciphertext_b64, iv=iv_b64)

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve secret",
        ) from e
