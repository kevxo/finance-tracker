import uuid
import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session
from db.schemas.budget import CreateBudget
from db.models.user import User
from db.models.budget import Budget
from db.models.expense import Expense
from datetime import date


def create_new_budget(budget: CreateBudget, db: Session, user: User):
    budget = Budget(uuid=str(uuid.uuid4()), user_uuid=user.uuid, **budget.model_dump())

    db.add(budget)
    db.commit()
    db.refresh(budget)

    return budget


def retrieve_budget(budget_uuid: str, user_uuid: str, db: Session):
    budget = (
        db.query(Budget)
        .filter(Budget.uuid == budget_uuid, Budget.user_uuid == user_uuid)
        .first()
    )

    return budget


def get_expenses_total_for_budget(user_uuid: str, db: Session, month: date):
    start_date = month
    end_date = start_date + datetime.timedelta(days=30)

    result = (
        db.query(func.sum(Expense.amount).label("total_amount"))
        .filter(
            Expense.user_uuid == user_uuid,
            Expense.date >= start_date,
            Expense.date <= end_date,
        )
        .first()
    )

    total_amount = result.total_amount if result and result.total_amount else 0

    return round(total_amount, 2)
