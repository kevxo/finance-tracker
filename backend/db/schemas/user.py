from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    username: str = Field(..., min_length=4)
    password: str = Field(..., min_length=4)


class ShowUser(BaseModel):
    uuid: str
    username: str

    class Config:
        orm_mode: True
