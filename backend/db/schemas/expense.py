from pydantic import BaseModel
from datetime import date


class UserExpenseCreate(BaseModel):
    amount: float
    category: str
    date: date


class ShowUserExpense(BaseModel):
    amount: float
    category: str
    date: date
    uuid: str
    user_uuid: str

    class Config:
        orm_mode = True
