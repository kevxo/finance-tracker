from fastapi import APIRouter

from api.v1 import user
from api.v1 import login

api_router = APIRouter()
api_router.include_router(user.router, prefix="", tags=["users"])
api_router.include_router(login.router, prefix="", tags=["login"])
