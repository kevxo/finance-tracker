from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy.orm import Session
from db.schemas.budget import ShowBudget, CreateBudget
from db.db_session import get_db
from db.models.user import User
from db.model_helpers.budget import create_new_budget, retrieve_budget, get_expenses_for_budget
from api.v1.login import get_current_user
from helpers.authentication import verify_current_user


router = APIRouter()


@router.post(
    "/api/v1/users/{user_uuid}/budgets",
    response_model=ShowBudget,
    status_code=status.HTTP_201_CREATED,
)
def create_budget(
    user_uuid: str,
    budget: CreateBudget,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_current_user(user_uuid, current_user.uuid)

    budget = create_new_budget(budget, db, current_user)

    return budget


@router.get(
    "/api/v1/users/{user_uuid}/budgets/{budget_uuid}",
    response_model=ShowBudget,
    status_code=status.HTTP_200_OK,
)
def get_budget(
    user_uuid: str,
    budget_uuid: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_current_user(user_uuid, current_user.uuid)

    budget = retrieve_budget(budget_uuid, user_uuid, db)
    expenses_for_budget = get_expenses_for_budget(user_uuid, db, budget.month)

    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Budget with uuid {budget_uuid} not found.",
        )

    return budget
