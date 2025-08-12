from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import  Session

from app import crud, schemas
from ..database import get_db

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)

@router.get("/", response_model=List[schemas.CategoryRead])
def read_categories(db: Session = Depends(get_db)):
    """
    Obtiene la lista de todas las categorías disponibles.
    """
    return crud.get_categories(db=db)