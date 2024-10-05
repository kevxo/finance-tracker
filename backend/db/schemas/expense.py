import datetime
from pydantic import BaseModel
from typing import Optional
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


class UpdateUserExpense(BaseModel):
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[datetime.date] = None
