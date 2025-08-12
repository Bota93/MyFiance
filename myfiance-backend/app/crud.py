from sqlalchemy.orm import Session
from app import models, schemas

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

def get_categories(db: Session):
    """
    Obtiene todas las caterogrías de gastos e ingresos.
    """
    return db.query(models.Category).all()