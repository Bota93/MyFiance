from pydantic import BaseModel, Field
from datetime import date, datetime
from enum import Enum
from decimal import Decimal

# --- Modelos de Datos para la API (Esquemas Pydantic) ---

class TransactionType(str, Enum):
    """
    Define los tipos de transacción permitidos mediante una enumeración (Enum).
    Esto garantiza que el campo 'type' solo puede ser 'income' o 'expense',
    evitando datos inválidos en la API y la base de datos.
    """
    INCOME = 'income'
    EXPENSE = 'expense'

class UserCreate(BaseModel):
    """
    Esquema para la creación de un nuevo usuario.
    Se utiliza para validar los datos de entrada (email y contraseña)
    cuando un usuario se registra en la aplicación.
    """
    email: str
    password: str

class UserLogin(BaseModel):
    """
    Esquema para la autenticación de un usuario existente.
    Valida los datos de entrada cuando un usuario intenta iniciar sesión.
    """
    email: str
    password: str

class CategoryRead(BaseModel):
    """
    Esquema de respuesta para los datos de una categoría.
    Se utiliza para formatear la información de las categorías que se envía
    desde la API hacia el cliente (frontend).
    """
    category_id: int
    category_name: str

    class Config:
        """
        Configuración de Pydantic para permitir la creación del esquema
        directamente desde un modelo de ORM (como SQLAlchemy).
        """
        from_attributes = True

class TransactionCreate(BaseModel):
    """
    Esquema para la creación de una transacción.
    Valida los datos de entrada del cuerpo de la petición (request body)
    cuando el usuario registra un nuevo ingreso o gasto.
    """
    amount: Decimal = Field(..., max_digits=10, decimal_places=2, gt=0)
    transaction_date: date
    description: str
    category_id : int
    type: TransactionType

class TransactionRead(BaseModel):
    """
    Esquema de respuesta para mostrar una transacción con todos sus detalles.
    Formatea los datos que la API envía al cliente. Incluye un objeto anidado
    'category' para enriquecer la respuesta y evitar llamadas adicionales
    desde el frontend para obtener el nombre de la categoría.
    """
    transaction_id: int
    amount: Decimal
    transaction_date: date
    description: str
    type: TransactionType
    category: CategoryRead

    class Config:
        """
        Permite que Pydantic mapee los datos desde el modelo de la base de datos
        al esquema de respuesta.
        """
        from_attributes = True

class UserRead(BaseModel):
    """
    Esquema para devolver la información de un usuario sin exponer la contraseña.
    """
    user_id: int
    email: str
    username: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    """
    Esquema para la respuesta del token de acceso.
    """
    access_token: str
    token_type: str