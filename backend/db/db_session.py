from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from config import settings

DATABASE_URL = settings.DATABASE_URL
print("Database URL is ", DATABASE_URL)
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(auto_commit=False, autoflush=False, bind=engine)