import base64

import pytest
from httpx import AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


CIPHERTEXT_B64 = base64.b64encode(b"encrypted_secret_data").decode("utf-8")
IV_B64 = base64.b64encode(b"0123456789ab").decode("utf-8")  # 12 bytes for AES-GCM


@pytest.mark.asyncio
async def test_create_secret(client: AsyncClient):
    response = await client.post(
        "/secrets",
        json={"ciphertext": CIPHERTEXT_B64, "iv": IV_B64},
    )

    assert response.headers.get("Cache-Control") == "no-store"
    assert response.status_code == 201

    data = response.json()
    assert len(data["id"]) > 0


@pytest.mark.asyncio
async def test_retrieve_secret(client: AsyncClient):
    create_response = await client.post(
        "/secrets",
        json={"ciphertext": CIPHERTEXT_B64, "iv": IV_B64},
    )
    secret_id = create_response.json()["id"]

    retrieve_response = await client.get(f"/secrets/{secret_id}")
    assert retrieve_response.headers.get("Cache-Control") == "no-store"
    assert retrieve_response.status_code == 200

    data = retrieve_response.json()
    assert data["ciphertext"] == CIPHERTEXT_B64
    assert data["iv"] == IV_B64


@pytest.mark.asyncio
async def test_secret_can_only_be_retrieved_once(client: AsyncClient):
    create_response = await client.post(
        "/secrets",
        json={"ciphertext": CIPHERTEXT_B64, "iv": IV_B64},
    )
    secret_id = create_response.json()["id"]

    first_response = await client.get(f"/secrets/{secret_id}")
    assert first_response.status_code == 200

    second_response = await client.get(f"/secrets/{secret_id}")
    assert second_response.status_code == 404


@pytest.mark.asyncio
async def test_secret_cannot_be_retrieved_after_expiration(
    client: AsyncClient,
    db_session: AsyncSession,
):
    create_response = await client.post(
        "/secrets",
        json={"ciphertext": CIPHERTEXT_B64, "iv": IV_B64},
    )
    secret_id = create_response.json()["id"]

    await db_session.execute(
        text(
            "UPDATE secrets SET expires_at = now() - interval '2 hours' WHERE id = :secret_id"
        ),
        {"secret_id": secret_id},
    )

    retrieve_response = await client.get(f"/secrets/{secret_id}")
    assert retrieve_response.status_code == 404


@pytest.mark.asyncio
async def test_invalid_base64_is_rejected(client: AsyncClient):
    response = await client.post(
        "/secrets",
        json={"ciphertext": "invalid-base64", "iv": IV_B64},
    )
    assert response.status_code == 422

    response = await client.post(
        "/secrets",
        json={"ciphertext": CIPHERTEXT_B64, "iv": "invalid-base64"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_invalid_iv_length_is_rejected(client: AsyncClient):
    short_iv = base64.b64encode(b"short").decode("utf-8")

    response = await client.post(
        "/secrets",
        json={"ciphertext": CIPHERTEXT_B64, "iv": short_iv},
    )

    assert response.status_code == 422
