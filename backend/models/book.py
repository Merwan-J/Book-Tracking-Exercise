from typing import Optional

from pydantic import BaseModel


class BookEntry(BaseModel):
    id: int
    title: str
    status: str = "to-read"


class BookCreate(BaseModel):
    title: str
    status: Optional[str] = "to-read"


class BookUpdate(BaseModel):
    new_status: str
