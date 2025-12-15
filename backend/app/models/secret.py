from datetime import datetime

from sqlalchemy import DateTime, Integer, LargeBinary, String, func, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Secret(Base):
    __tablename__ = "secrets"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    ciphertext: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    iv: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    views_remaining: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=text("now() + interval '1 hour'"),
        nullable=False,
        index=True,
    )
