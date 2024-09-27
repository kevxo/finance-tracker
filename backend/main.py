from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.db_session import engine
from db.base import Base
from db.config import settings

def create_tables():
    Base.metadata.create_all(bind=engine)

def start_services():
    app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)
    create_tables()

    return app

app = start_services()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello, world!"}