from sqlalchemy import String, Column, ForeignKey, Float, Date, DateTime, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base_class import Base


class Budget(Base):
    uuid = Column(String(36), primary_key=True, index=True)
    user_uuid = Column(String, ForeignKey("user.uuid"))
    budget_amount = Column(Float, nullable=False)
    month = Column(Date, nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    __table_args__ = (Index("idx_user_uuid_month", "user_uuid", "month"),)

    owner = relationship("User", back_populates="budgets")
