"""Add index to user_uuid and month

Revision ID: 7a70097ebe35
Revises: 1903fdab5dae
Create Date: 2024-12-17 12:46:23.646081

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "7a70097ebe35"
down_revision: Union[str, None] = "1903fdab5dae"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index(
        "idx_user_uuid_month", "budget", ["user_uuid", "month"], unique=False
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index("idx_user_uuid_month", table_name="budget")
    # ### end Alembic commands ###
