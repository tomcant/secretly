import base64
import binascii
import math
from typing import Annotated

from pydantic import BaseModel, Field, field_validator


# Size limit to prevent DoS attacks
MAX_CIPHERTEXT_LEN = 10 * 1024 * 1024  # 10 MB

# AES-GCM expects a 12-byte IV/nonce.
AES_GCM_IV_LEN = 12


class CreateSecretRequest(BaseModel):
    ciphertext: Annotated[
        str,
        Field(
            description="Base64-encoded encrypted secret data",
            max_length=math.ceil(MAX_CIPHERTEXT_LEN * 4 / 3),
        ),
    ]
    iv: Annotated[
        str,
        Field(
            description="Base64-encoded initialisation vector",
            max_length=math.ceil(AES_GCM_IV_LEN * 4 / 3),
        ),
    ]

    @field_validator("ciphertext")
    @classmethod
    def validate_ciphertext_base64(cls, v: str) -> str:
        try:
            decoded = base64.b64decode(v, validate=True)
            if len(decoded) > MAX_CIPHERTEXT_LEN:
                raise ValueError(
                    f"ciphertext exceeds maximum size of {MAX_CIPHERTEXT_LEN} bytes"
                )
            return v
        except binascii.Error as e:
            raise ValueError(f"Invalid base64 format: {str(e)}") from e

    @field_validator("iv")
    @classmethod
    def validate_iv_base64(cls, v: str) -> str:
        try:
            decoded = base64.b64decode(v, validate=True)
            if len(decoded) != AES_GCM_IV_LEN:
                raise ValueError(
                    f"iv must be exactly {AES_GCM_IV_LEN} bytes for AES-GCM"
                )
            return v
        except binascii.Error as e:
            raise ValueError(f"Invalid base64 format: {str(e)}") from e


class CreateSecretResponse(BaseModel):
    id: Annotated[
        str,
        Field(description="Unique identifier for the secret"),
    ]


class GetSecretResponse(BaseModel):
    ciphertext: Annotated[
        str,
        Field(description="Base64-encoded encrypted secret data"),
    ]
    iv: Annotated[
        str,
        Field(description="Base64-encoded initialisation vector"),
    ]
