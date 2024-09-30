from pydantic import BaseModel
from datetime import date


class CreateBudget(BaseModel):
    budget_amount: float
    month: date
