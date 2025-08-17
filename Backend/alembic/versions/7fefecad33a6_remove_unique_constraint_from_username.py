"""remove_unique_constraint_from_username

Revision ID: 7fefecad33a6
Revises: bbcc214897f2
Create Date: 2025-08-17 20:09:45.998395

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7fefecad33a6'
down_revision: Union[str, None] = 'bbcc214897f2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Remove the unique constraint from the username column
    op.drop_constraint('users_username_key', 'users', type_='unique')


def downgrade() -> None:
    """Downgrade schema."""
    # Add the unique constraint back to the username column
    op.create_unique_constraint('users_username_key', 'users', ['username'])
