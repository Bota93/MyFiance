from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import auth, crud, schemas
from ..database import get_db

# APIRouter nos permite agrupar endpoints y luego incluirlos en la app principal
router = APIRouter(
    prefix="/users", # Prefijo para todas las rutas de este router
    tags=["Users"],  # Etiqueta para la documentación de la API
)

@router.post("/register", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Endpoint para registrar un nuevo usuario.
    """
    db_user = auth.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    # Hasheamos la contraseña antes de pasarla a la función de creación
    hashed_password = auth.get_password_hash(user.password)
    
    # Llamamos a la función del CRUD para crear el usuario
    return crud.create_user(db=db, user=user, hashed_password=hashed_password)

@router.post("/token", response_model=schemas.Token)
def login_for_access_token_endpoint(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Endpoint para iniciar sesión y obtener un token de acceso.
    """
    #Verificamos si el usuario existe y si la contraseña es correcta
    user = auth.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Creamos el token de acceso
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}