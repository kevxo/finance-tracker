import uuid
import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session
from db.schemas.budget import CreateBudget, BudgetUpdatePayload
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


def get_all_budget_history(user_uuid: str, db: Session):
    budgets = db.query(Budget).filter(Budget.user_uuid == user_uuid).all()

    if len(budgets) == 0:
        return []

    budget_history = []
    for budget in budgets:
        expenses_total_for_budget = get_expenses_total_for_budget(
            user_uuid, db, budget.month
        )
        remaining_budget = round(budget.budget_amount - expenses_total_for_budget, 2)

        budget_history.append(
            {
                "month": budget.month,
                "budget_amount": budget.budget_amount,
                "expenses_total": expenses_total_for_budget,
                "remaining_budget": remaining_budget,
                "uuid": budget.uuid,
            }
        )

    return budget_history


def update_budget(
    user_uuid: str,
    budget_uuid: str,
    budget_update_payload: BudgetUpdatePayload,
    db: Session,
):
    db.query(Budget).filter(
        Budget.uuid == budget_uuid, Budget.user_uuid == user_uuid
    ).update(budget_update_payload)
    db.commit()

    updated_budget = retrieve_budget(budget_uuid, user_uuid, db)

    return updated_budget
