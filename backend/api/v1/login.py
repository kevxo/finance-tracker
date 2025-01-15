from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, APIRouter, status, HTTPException
from sqlalchemy.orm import Session

from db.db_session import get_db
from db.schemas.token import Token
from helpers.authentication import create_access_token, authenticate_user

router = APIRouter()


@router.post("/api/v1/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    access_token = create_access_token(data={"sub": user.username, "uuid": user.uuid})

    return {"access_token": access_token, "token_type": "bearer"}
