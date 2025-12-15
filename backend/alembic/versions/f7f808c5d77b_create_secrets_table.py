"""
Create secrets table

Revision ID: f7f808c5d77b
Revises:
Create Date: 2025-12-08 00:44:25.600514

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f7f808c5d77b"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "secrets",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("ciphertext", sa.LargeBinary(), nullable=False),
        sa.Column("iv", sa.LargeBinary(), nullable=False),
        sa.Column("views_remaining", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "expires_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now() + interval '1 hour'"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_secrets_created_at"), "secrets", ["created_at"], unique=False
    )
    op.create_index(
        op.f("ix_secrets_expires_at"), "secrets", ["expires_at"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_secrets_expires_at"), table_name="secrets")
    op.drop_index(op.f("ix_secrets_created_at"), table_name="secrets")
    op.drop_table("secrets")
