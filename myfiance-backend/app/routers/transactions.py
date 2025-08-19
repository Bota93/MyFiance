from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app import crud, models, schemas, auth
from app.database import get_db

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

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction_endpoint(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Elimina una transacción del usuario autenticado
    """
    crud.delete_transaction(db=db, transaction_id=transaction_id, user_id=current_user.user_id)
    # Devuelve una respuesta vacía con el código 204, que significa "éxito sin contenido"
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.put("/{transaction_id}", response_model=schemas.TransactionRead)
def update_transaction_endpoint(
    transaction_id: int,
    transaction_data: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Actualiza una transacción existente del usuario autenticado.
    """
    return crud.update_transaction(
        db=db,
        transaction_id=transaction_id,
        transaction_data=transaction_data,
        user_id=current_user.user_id
    )