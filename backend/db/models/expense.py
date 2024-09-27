from sqlalchemy import String, Column, ForeignKey, Float, Date
from sqlalchemy.orm import relationship
from db.base_class import Base


class Expense(Base):
    uuid = Column(String(36), primary_key=True, index=True)
    user_uuid = Column(String, ForeignKey('user.uuid'))
    amount = Column(Float, nullable=False)
    category = Column(String, index=True)
    date = Column(Date, nullable=False)

    owner = relationship("User", back_populates="expenses")