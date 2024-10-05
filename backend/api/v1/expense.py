from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from db.schemas.expense import UserExpenseCreate, ShowUserExpense, UpdateUserExpense
from db.db_session import get_db
from db.models.user import User
from db.model_helpers.expense import (
    create_new_user_expense,
    list_expenses,
    get_single_expense,
    update_expense,
)

from api.v1.login import get_current_user

router = APIRouter()


@router.post(
    "/api/v1/users/{user_uuid}/expenses",
    response_model=ShowUserExpense,
    status_code=status.HTTP_201_CREATED,
)
def create_expense(
    user_uuid: str,
    expense: UserExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user_uuid != current_user.uuid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User in not authorized."
        )

    user_expense = create_new_user_expense(
        expense=expense, current_user=current_user, db=db
    )

    return user_expense


@router.get("/api/v1/users/{user_uuid}/expenses", response_model=List[ShowUserExpense])
def get_all_expenses(
    user_uuid: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if user_uuid != current_user.uuid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User in not authorized."
        )

    expenses = list_expenses(db, user_uuid)

    return expenses


@router.get("/api/v1/users/{user_uuid}/expenses/{expense_uuid}")
def get_expense(
    user_uuid: str,
    expense_uuid: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if user_uuid != current_user.uuid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User in not authorized."
        )

    expense = get_single_expense(db, user_uuid, expense_uuid)

    if not expense:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with uuid {expense_uuid} was not found.",
        )

    return expense


@router.patch(
    "/api/v1/users/{user_uuid}/expenses/{expense_uuid}", response_model=ShowUserExpense
)
def patch_expense(
    user_uuid: str,
    expense_uuid: str,
    body: UpdateUserExpense,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if user_uuid != current_user.uuid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User in not authorized."
        )

    update_data = body.model_dump(exclude_unset=True)
    updated_expense = update_expense(db, expense_uuid, user_uuid, update_data)

    if not updated_expense:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with uuid {expense_uuid} was not found.",
        )

    return updated_expense
