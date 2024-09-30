from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt

from db.config import settings
from helpers.hashing import Hasher
from db.model_helpers.user import get_user
from sqlalchemy.orm import Session


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )

    return encoded_jwt


def authenticate_user(username: str, password: str, db: Session):
    user = get_user(username=username, db=db)

    if not user:
        return False
    if not Hasher.verify_password(password, user.password):
        return False

    return user
