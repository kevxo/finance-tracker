import uuid

from fastapi import status, HTTPException
from helpers.hashing import Hasher
from db.models.user import User
from db.schemas.user import UserCreate
from sqlalchemy.orm import Session


def register_new_user(user: UserCreate, db: Session):
    existing_user = (
        db.query(User).filter(User.username == user.username.lower()).first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists"
        )

    user = User(
        uuid=str(uuid.uuid4()),
        username=user.username.lower(),
        password=Hasher.get_password_hash(user.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_user(username: str, db: Session):
    user = db.query(User).filter(User.username == username).first()

    return user
