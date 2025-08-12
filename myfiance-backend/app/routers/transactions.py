from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas, auth
from ..database import get_db

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
    dependencies=[Depends(auth.get_current_user)] # Protege todas las rutas de este router
)

@router.post("/", response_model=schemas.TransactionRead)
def create_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Crea una nueva transacción para el usuario autenticado.
    """
    return crud.create_user_transaction(db=db, transaction=transaction, user_id=current_user.user_id)

@router.get("/", response_model=List[schemas.TransactionRead])
def read_transactions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Obtiene todas las transacciones del usuario autenticado.
    """
    return crud.get_transactions_by_user(db=db, user_id=current_user.user_id)