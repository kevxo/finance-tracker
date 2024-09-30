from sqlalchemy.orm import Session
from db.model_helpers.user import register_new_user, get_user
from db.schemas.user import UserCreate


def create_random_user(db: Session):
    user = UserCreate(username="kevxo",password="Hello!")
    user = register_new_user(user=user, db=db)

    return user

