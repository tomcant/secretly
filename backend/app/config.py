from typing_extensions import Self

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings
from sqlalchemy.engine.url import make_url


class Settings(BaseSettings):
    APP_ENV: str = Field(default="dev")
    DATABASE_URL: str = Field(..., min_length=1)
    CORS_ALLOWED_ORIGIN: str = Field(..., min_length=1)

    @model_validator(mode="after")
    def test_settings(self) -> Self:
        if self.APP_ENV != "test":
            return self

        database_url = make_url(self.DATABASE_URL).set(database="secretly_test")
        self.DATABASE_URL = database_url.render_as_string(hide_password=False)

        return self


settings = Settings()
