from pydantic import BaseModel
from datetime import date


class CreateExpense(BaseModel):
    amount: float
    category: str
    date: date
