from sqlalchemy.orm import Session
from app import models, schemas
from fastapi import HTTPException, status

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    """
    Crea un nuevo usuario en la base de datos.

    Args:
        db: La sesión de la base de datos.
        user: Un objeto UserCreate con los datos del nuevo usuario.

    Returns:
        El nuevo objeto User creado.
    """
    db_user = models.User(
        email=user.email,
        username=user.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_transactions_by_user(db: Session, user_id: int):
    """
    Obtiene todas las transacciones de un usuario específico.
    """
    return db.query(models.Transaction).filter(models.Transaction.user_id == user_id).all()

def create_user_transaction(db: Session, transaction: schemas.TransactionCreate, user_id: int):
    """
    Crea una nueva transacción para un usuario.
    """
    db_transaction = models.Transaction(
        **transaction.dict(), # Desempaqueta el Pydantic model
        user_id=user_id
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def delete_transaction(db: Session, transaction_id: int, user_id: int):
    """
    Elimina una transacción.
    Verifica que la transacción pertenezca al usuario antes de eliminarla.
    """
    db_transaction = db.query(models.Transaction).filter(
        models.Transaction.transaction_id == transaction_id
    ).first()

    # Si no se encuentra la transacción, devuelve un error 404
    if not db_transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transacción no encontrada")
    
    # Si el ID del dueño de la transacción no coincide con el del usuario actual, deuelve un error 403
    if db_transaction.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permiso para eliminar esta transacción")
    
    db.delete(db_transaction)
    db.commit()
    return {"ok": True}

def update_transaction(db: Session, transaction_id: int, transaction_data: schemas.TransactionCreate, user_id: int):
    """
    Actualiza una transacción existente.
    Verifica que la transacción pertenezca al usuario antes de actualizar.
    """
    db_transaction = db.query(models.Transaction).filter(
        models.Transaction.transaction_id == transaction_id
    ).first()

    if not db_transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transacción no encontrada")
    
    if db_transaction.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permisos para editar esta transacción")
    
    # Itera sobre los datos recibidos y actualiza el objeto de la base de datos
    for key, value in transaction_data.dict().items():
        setattr(db_transaction, key, value)

    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_categories(db: Session):
    """
    Obtiene todas las caterogrías de gastos e ingresos.
    """
    return db.query(models.Category).all()