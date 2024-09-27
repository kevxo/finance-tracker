from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from typing import Generator

from db.config import settings

DATABASE_URL = settings.DATABASE_URL
print("Database URL is ", DATABASE_URL)
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator:
    try:
        db = SessionLocal()

        yield db
    finally:
        db.close()
