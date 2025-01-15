from datetime import datetime, timedelta, timezone
from fastapi import status, HTTPException, Depends
from typing import Optional
from jose import JWTError, jwt
from db.model_helpers.user import get_user
from fastapi.security import OAuth2PasswordBearer

from db.config import settings
from helpers.hashing import Hasher
from sqlalchemy.orm import Session
from db.models.user import User
from db.db_session import get_db


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


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user(username=username, db=db)

    if user is None:
        raise credentials_exception

    return user


def verify_current_user(user_uuid: str, current_user: User = Depends(get_current_user)):
    if user_uuid != current_user.uuid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User in not authorized."
        )

    return current_user
