from pydantic import BaseModel, UUID4
from datetime import date


class CreateBudget(BaseModel):
    budget_amount: float
    month: date


class ShowBudget(BaseModel):
    uuid: UUID4
    budget_amount: float
    month: date
