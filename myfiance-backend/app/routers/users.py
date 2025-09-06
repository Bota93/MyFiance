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
    Crea un nuevo usuario.
    Endpoint para registrar un nuevo usuario. Comprueba si el email ya existe antes de la creación.
    La contraseña se hashea antes de guardarla en la base de datos.

    Args:
        user (schemas.UserCreate): Datos del nuevo usuario (email, contraseña).
        db (Session): Dependencia de la sesión de la base de datos.

    Returns:
        schemas.UserRead: Los datos del usuario creado (sin la contraseña).
    """
    db_user = auth.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    hashed_password = auth.get_password_hash(user.password)
    
    return crud.create_user(db=db, user=user, hashed_password=hashed_password)


@router.post("/token", response_model=schemas.Token)
def login_for_access_token_endpoint(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Autentica a un usuario y devuelve un token de acceso JWT.
    Verifica las credenciales del usuario. Si el usuario es 'demo@example.com',
    reinicia sus datos para proporcionar una experiencia de demostración limpia.
    
    Args:
        db (Session): Dependencia de la sesión de la base de datos.
        form_data (OAuth2PasswordRequestForm): Datos del formulario de login (username, password).
        
    Returns:
        schemas.Token: Un objeto que contiene el access_token y el token_type
    """

    user = auth.get_user_by_email(db, email=form_data.username)

    if form_data.username == "demo@example.com":
        if not user:
            hashed_password = auth.get_password_hash("demopassword")
            demo_user_schema = schemas.UserCreate(email="demo@example.com", password=hashed_password)
            user = crud.create_user(db=db, user=demo_user_schema, hashed_password=hashed_password)
        
        if not auth.verify_password("demopassword", user.password_hash):
            hashed_password = auth.get_password_hash("demopassword")
            user.password_hash = hashed_password
            db.commit()
            user = crud.get_user(db=db, user_id=user.user_id)
            
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.email == "demo@example.com":
        crud.reset_demo_user_data(db=db, user_id=user.user_id)

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
