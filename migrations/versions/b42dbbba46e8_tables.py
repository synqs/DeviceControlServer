"""tables

Revision ID: b42dbbba46e8
Revises: 
Create Date: 2019-12-12 15:42:01.720542

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b42dbbba46e8'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('arduino_serial',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('thread_id', sa.Integer(), nullable=True),
    sa.Column('switch', sa.Boolean(), nullable=True),
    sa.Column('name', sa.String(length=64), nullable=True),
    sa.Column('ard_str', sa.String(length=120), nullable=True),
    sa.Column('baud_rate', sa.Integer(), nullable=True),
    sa.Column('serial_port', sa.String(length=64), nullable=True),
    sa.Column('sleeptime', sa.Float(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('thread_id')
    )
    op.create_table('camera',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('thread_id', sa.Integer(), nullable=True),
    sa.Column('switch', sa.Boolean(), nullable=True),
    sa.Column('name', sa.String(length=64), nullable=True),
    sa.Column('ard_str', sa.String(length=120), nullable=True),
    sa.Column('folder', sa.String(length=240), nullable=True),
    sa.Column('xMin', sa.Integer(), nullable=True),
    sa.Column('xMax', sa.Integer(), nullable=True),
    sa.Column('yMin', sa.Integer(), nullable=True),
    sa.Column('yMax', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('thread_id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=64), nullable=True),
    sa.Column('email', sa.String(length=120), nullable=True),
    sa.Column('password_hash', sa.String(length=128), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_index(op.f('ix_user_username'), 'user', ['username'], unique=True)
    op.create_table('web_temp_control',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('switch', sa.Boolean(), nullable=True),
    sa.Column('name', sa.String(length=64), nullable=True),
    sa.Column('ard_str', sa.String(length=120), nullable=True),
    sa.Column('sleeptime', sa.Float(), nullable=True),
    sa.Column('ip_adress', sa.String(length=64), nullable=True),
    sa.Column('port', sa.String(length=64), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('setpoint', sa.Float(), nullable=True),
    sa.Column('gain', sa.Float(), nullable=True),
    sa.Column('integral', sa.Float(), nullable=True),
    sa.Column('diff', sa.Float(), nullable=True),
    sa.Column('value', sa.Float(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('web_temp_control')
    op.drop_index(op.f('ix_user_username'), table_name='user')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    op.drop_table('camera')
    op.drop_table('arduino_serial')
    # ### end Alembic commands ###