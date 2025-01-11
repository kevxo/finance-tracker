from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy.orm import Session
from db.schemas.budget import (
    ShowBudget,
    CreateBudget,
    ShowBudgetHistory,
    BudgetUpdatePayload,
)
from db.db_session import get_db
from db.models.user import User
from db.model_helpers.budget import (
    create_new_budget,
    retrieve_budget,
    get_expenses_total_for_budget,
    get_all_budget_history,
    update_budget,
)
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
    current_user: User = Depends(verify_current_user),
):

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
    current_user: User = Depends(verify_current_user),
):

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
    current_user: User = Depends(verify_current_user),
):

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


@router.patch(
    "/api/v1/users/{user_uuid}/budgets/{budget_uuid}", status_code=status.HTTP_200_OK
)
def update_user_budget(
    user_uuid: str,
    budget_uuid: str,
    update_budget_payload: BudgetUpdatePayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_current_user),
):
    update_budget_payload = update_budget_payload.model_dump(exclude_unset=True)
    updated_budget = update_budget(user_uuid, budget_uuid, update_budget_payload, db)

    if not updated_budget:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with uuid {budget_uuid} was not found.",
        )

    expenses_total_for_budget = get_expenses_total_for_budget(
        user_uuid, db, updated_budget.month
    )
    remaining_budget = round(
        updated_budget.budget_amount - expenses_total_for_budget, 2
    )

    return {
        "month": updated_budget.month,
        "budget_amount": updated_budget.budget_amount,
        "expenses_total": expenses_total_for_budget,
        "remaining_budget": remaining_budget,
        "uuid": updated_budget.uuid,
    }
