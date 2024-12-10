from fastapi import APIRouter, status, HTTPException, Depends
from fastapi_pagination import Page
from sqlalchemy.orm import Session

from db.schemas.expense import (
    UserExpenseCreate,
    ShowUserExpense,
    UpdateUserExpense,
    DeleteExpenses,
)
from db.db_session import get_db
from db.models.user import User
from db.model_helpers.expense import (
    create_new_user_expense,
    list_expenses,
    get_single_expense,
    update_expense,
    delete_user_expense,
)

from api.v1.login import get_current_user
from helpers.authentication import verify_current_user

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
    verify_current_user(user_uuid, current_user.uuid)

    user_expense = create_new_user_expense(
        expense=expense, current_user=current_user, db=db
    )

    return user_expense


@router.get("/api/v1/users/{user_uuid}/expenses", response_model=Page[ShowUserExpense])
def get_all_expenses(
    user_uuid: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_current_user(user_uuid, current_user.uuid)

    expenses = list_expenses(db, user_uuid)

    return expenses


@router.get("/api/v1/users/{user_uuid}/expenses/{expense_uuid}")
def get_expense(
    user_uuid: str,
    expense_uuid: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_current_user(user_uuid, current_user.uuid)

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
    verify_current_user(user_uuid, current_user.uuid)

    update_data = body.model_dump(exclude_unset=True)
    updated_expense = update_expense(db, expense_uuid, user_uuid, update_data)

    if not updated_expense:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with uuid {expense_uuid} was not found.",
        )

    return updated_expense


@router.delete("/api/v1/users/{user_uuid}/expenses")
def delete_expense(
    user_uuid: str,
    body: DeleteExpenses,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verify_current_user(user_uuid, current_user.uuid)

    if len(body.uuids) == 0:
        raise HTTPException(
            detail="Pass UUID(s), none were given.",
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    message = delete_user_expense(db, body.uuids)

    return {"message": message.get("msg")}
