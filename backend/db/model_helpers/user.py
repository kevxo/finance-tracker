import uuid

from helpers.hashing import Hasher
from db.models.user import User
from db.schemas.user import UserCreate
from sqlalchemy.orm import Session

def register_new_user(user: UserCreate, db: Session):
    user = User(
        uuid = str(uuid.uuid4()),
        username = user.username.lower(),
        password = Hasher.get_password_hash(user.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def get_user(username: str, db: Session):
    user = db.query(User).filter(User.username == username).first()

    return user