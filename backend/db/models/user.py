from sqlalchemy import String, Column
from sqlalchemy.orm import relationship
from db.base_class import Base

class User(Base):
    uuid = Column(String(36), primary_key=True, index=True)
    username = Column(String(), nullable=False, unique=True, index=True)
    password = Column(String(), nullable=False)

    expenses = relationship("Expense", back_populates="owner")
    budgets = relationship("Budget", back_populates="owner")
