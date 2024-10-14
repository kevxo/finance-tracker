from sqlalchemy.orm import Session
from db.model_helpers.user import register_new_user
from db.model_helpers.expense import create_new_user_expense
from db.model_helpers.budget import create_new_budget
from db.schemas.user import UserCreate
from db.schemas.expense import UserExpenseCreate
from db.schemas.budget import CreateBudget

from random import randrange


def create_random_user(db: Session):
    user = UserCreate(username="kevxo", password="Hello!")
    user = register_new_user(user=user, db=db)

    return user


def create_random_expense(db: Session):
    user = create_random_user(db)

    expense = UserExpenseCreate(
        amount=float(randrange(10, 1000)), category="Insurance", date="2024-10-09"
    )

    expense = create_new_user_expense(expense, user, db)

    return expense


def create_random_budget(db: Session):
    user = create_random_user(db)

    budget = CreateBudget(budget_amount=1500.00, month="2024-10-13")

    budget = create_new_budget(budget, db, user)

    return budget
