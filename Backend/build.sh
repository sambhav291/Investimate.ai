#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python -c "
import os
from sqlalchemy import create_engine
from Auth.models import Base

# Create database tables
engine = create_engine(os.getenv('DATABASE_URL'))
Base.metadata.create_all(engine)
print('Database tables created successfully!')
"
