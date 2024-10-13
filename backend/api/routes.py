from fastapi import APIRouter

from api.v1 import user
from api.v1 import login
from api.v1 import expense
from api.v1 import budget

api_router = APIRouter()
api_router.include_router(user.router, prefix="", tags=["users"])
api_router.include_router(login.router, prefix="", tags=["login"])
api_router.include_router(expense.router, prefix="", tags=["expenses"])
api_router.include_router(budget.router, prefix="", tags=["budgets"])
