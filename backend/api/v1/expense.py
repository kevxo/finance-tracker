from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy.orm import Session

from db.schemas.expense import UserExpenseCreate, ShowUserExpense
from db.db_session import get_db
from db.models.user import User
from db.model_helpers.expense import create_new_user_expense

from api.v1.login import get_current_user

router = APIRouter()


@router.post(
    "/api/v1/user/{user_uuid}/expenses",
    response_model=ShowUserExpense,
    status_code=status.HTTP_201_CREATED,
)
def create_user_expense(
    user_uuid: str,
    expense: UserExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    print(current_user, "lookhere")
    if user_uuid is not current_user.uuid:
        HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User in not authorized."
        )

    user_expense = create_new_user_expense(
        expense=expense, current_user=current_user, db=db
    )

    return user_expense
