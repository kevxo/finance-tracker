from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy.orm import Session
from db.schemas.budget import ShowBudget, CreateBudget, ShowBudgetHistory
from db.db_session import get_db
from db.models.user import User
from db.model_helpers.budget import (
    create_new_budget,
    retrieve_budget,
    get_expenses_total_for_budget,
    get_all_budget_history,
)
from api.v1.login import get_current_user
from helpers.authentication import verify_current_user

from typing import List


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
    "/api/v1/users/{user_uuid}/budgets/history",
    status_code=status.HTTP_200_OK,
    response_model=List[ShowBudgetHistory],
)
def get_budget_history(
    user_uuid: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_current_user(user_uuid, current_user.uuid)

    history = get_all_budget_history(user_uuid, db)

    return history


@router.get(
    "/api/v1/users/{user_uuid}/budgets/{budget_uuid}",
    status_code=status.HTTP_200_OK,
    response_model=ShowBudgetHistory,
)
def get_budget(
    user_uuid: str,
    budget_uuid: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_current_user(user_uuid, current_user.uuid)

    budget = retrieve_budget(budget_uuid, user_uuid, db)
    expenses_total_for_budget = get_expenses_total_for_budget(
        user_uuid, db, budget.month
    )
    remaining_budget = round(budget.budget_amount - expenses_total_for_budget, 2)

    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Budget with uuid {budget_uuid} not found.",
        )

    return {
        "month": budget.month,
        "budget_amount": budget.budget_amount,
        "expenses_total": expenses_total_for_budget,
        "remaining_budget": remaining_budget,
        "uuid": budget.uuid,
    }
