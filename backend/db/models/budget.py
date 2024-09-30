from sqlalchemy import String, Column, ForeignKey, Float, Date
from sqlalchemy.orm import relationship
from db.base_class import Base


class Budget(Base):
    uuid = Column(String(36), primary_key=True, index=True)
    user_uuid = Column(String, ForeignKey("user.uuid"))
    budget_amount = Column(Float, nullable=False)
    month = Column(Date, nullable=False)

    owner = relationship("User", back_populates="budgets")
