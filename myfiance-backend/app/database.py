import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Carga las variables del archivo .env
load_dotenv()

# Obtén las credenciales de la base de datos
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_PORT = os.getenv("DB_PORT")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# --- Configuración de SQLALchemy ---

# El 'engine' es el punto de entrada a la base de datos.
# Gestiona el dialecto de la BD y el pool de conexiones.
engine = create_engine(DATABASE_URL)

# 'SessionLocal' es una "fábrica" de sesiones de bases de datos.
# Cada instancia de SessionLocal será una sesión de base de datos.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 'Base' es una clase base que nuestros modelos de ORM (tablas) heredarán.
Base = declarative_base()


# --- Dependencia de FastAPI ---
def get_db():
    """
    Dependencia de FastAPI para obtener una sesión de base de datos.
    Esto asegura que la sesión se cree al inicio de la petición
    y se cierre siempre al final, incluso si ocurren errores.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()