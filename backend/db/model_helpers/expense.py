import uuid

from sqlalchemy.orm import Session
from db.schemas.expense import UserExpenseCreate
from db.models.user import User
from db.models.expense import Expense


def create_new_user_expense(
    expense: UserExpenseCreate, current_user: User, db: Session
):
    new_expense = Expense(
        uuid=str(uuid.uuid4()), user_uuid=current_user.uuid, **expense.model_dump()
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return new_expense


def list_expenses(db: Session, user_uuid: str):
    expenses = db.query(Expense).filter(Expense.user_uuid == user_uuid).all()

    return expenses


def get_single_expense(db: Session, user_uuid: str, expense_uuid: str):
    expense = (
        db.query(Expense)
        .filter(Expense.user_uuid == user_uuid, Expense.uuid == expense_uuid)
        .first()
    )

    return expense
