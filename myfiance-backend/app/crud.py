from sqlalchemy.orm import Session
from app import models, schemas
from fastapi import HTTPException, status


def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    """
    Crea un nuevo usuario en la base de datos.

    Args:
        db: La sesión de la base de datos.
        user: Un objeto UserCreate con los datos del nuevo usuario.
        hashed_password (str): La contraseña ya hasheada.

    Returns:
        model.User: El objeto del usuario recien creado.
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

    Args:
        db (Session): La sesión de la base de datos.
        user_id (int): El ID el usuario propietario de la transacción.

    Returns:
        lsit[models.Transaction]: Una lista de las transacciones del usuario.
    """
    return db.query(models.Transaction).filter(models.Transaction.user_id == user_id).all()


def create_user_transaction(db: Session, transaction: schemas.TransactionCreate, user_id: int):
    """
    Crea una nueva transacción para un usuario.

    Args:
        db (Session): La sesiṕn de la base de datos.
        transaction (schemas.TransactionCreate): Los datos de la transacción a crear.
        user_id (int): El ID del usuario que crea la transacción.

    Return:
        models.Transaction: La transacción recién creada.
    """
    db_transaction = models.Transaction(
        **transaction.dict(),  # Desempaqueta el Pydantic model
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

    Args:
        db (Session): La sesión de la base de datos.
        transaction_id (int): El ID de la transacción a eliminar.
        user_id (int): El ID del usuario que solicita la eliminación.

    Returns:
        dic: Un diccionario confirmando la operación.
    """
    db_transaction = db.query(models.Transaction).filter(
        models.Transaction.transaction_id == transaction_id
    ).first()

    # Si no se encuentra la transacción, devuelve un error 404
    if not db_transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Transacción no encontrada")

    # Si el ID del dueño de la transacción no coincide con el del usuario actual, deuelve un error 403
    if db_transaction.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="No tienes permiso para eliminar esta transacción")

    db.delete(db_transaction)
    db.commit()
    return {"ok": True}


def update_transaction(db: Session, transaction_id: int, transaction_data: schemas.TransactionCreate, user_id: int):
    """
    Actualiza una transacción existente.
    Verifica que la transacción pertenezca al usuario antes de actualizar.

    Args:
        db (Session): La sesión de la base de datos.
        transaction_id (int): El ID de la transacción a actualizar.
        transaction_data (schemas.TransactionCreate): Los nuevos datos para la transacción.
        user_id (int): El ID del usuario que solicita la actualización.

    Returns:
        models.Transaction: La transacción actualizada.
    """
    db_transaction = db.query(models.Transaction).filter(
        models.Transaction.transaction_id == transaction_id
    ).first()

    if not db_transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Transacción no encontrada")

    if db_transaction.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="No tienes permisos para editar esta transacción")

    # Itera sobre los datos recibidos y actualiza el objeto de la base de datos
    for key, value in transaction_data.dict().items():
        setattr(db_transaction, key, value)

    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def get_categories(db: Session):
    """
    Obtiene todas las caterogrías de gastos e ingresos.

    Args:
        db (Session): La sesión de la base de datos.

    Returns:
        list[model.Category]: Una lista de todas las categorías.
    """
    return db.query(models.Category).all()


def reset_demo_user_data(db: Session, user_id: int):
    """
    Reinicia los datos para el usuario de demostración.
    Primero, elimina todas las transacciones existentes del usuario.
    Luego, crea un conjunto de transacciones de ejemplo para la demo.

    Args:
        db: La sesión de base de datos
        user_id: El ID del usuario de demostración
    """
    # Elimina las transacciones existentes
    db.query(models.Transaction).filter(
        models.Transaction.user_id == user_id).delete()

    # Crea nuevos datos de ejemplo
    seed_transactions = [
        models.Transaction(user_id=user_id, amount=1500.00, transaction_date="2025-08-01",
                           description="Salario de Agosto", category_id=1, type="income"),
        models.Transaction(user_id=user_id, amount=55.40, transaction_date="2025-08-03",
                           description="Compra semanal", category_id=3, type="expense"),
        models.Transaction(user_id=user_id, amount=12.00, transaction_date="2025-08-05",
                           description="Café con amigos", category_id=6, type="expense"),
    ]
    db.add_all(seed_transactions)
    db.commit()
