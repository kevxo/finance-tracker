from pydantic import BaseModel, UUID4
from datetime import date


class CreateBudget(BaseModel):
    budget_amount: float
    month: date


class ShowBudget(BaseModel):
    uuid: UUID4
    budget_amount: float
    month: date
    user_uuid: UUID4
    expenses_total: float
    remmaining_amount: float

    class Config:
        orm_mode = True
