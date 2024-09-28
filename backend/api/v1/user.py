from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy.orm import Session

from db.schemas.user import UserCreate, ShowUser
from db.db_session import get_db
from db.model_helpers.user import register_new_user

router = APIRouter()

@router.post("/api/v1/register_user", response_model=ShowUser, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    user = register_new_user(user = user, db = db)

    if not user:
        raise HTTPException(
            detail="User not created correctly. Please try again",
            status_code=status.HTTP_400_BAD_REQUEST
        )

    return user