import uuid

from sqlalchemy.orm import Session
from db.schemas.budget import CreateBudget
from db.models.user import User
from db.models.budget import Budget


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
