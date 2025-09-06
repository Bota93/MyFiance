from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, SessionLocal
from app.routers import users, transactions, categories
from app import models
import time

# Crea las tablas en la base de datos si no existen
# (En un entorno de producción, esto se gestiona con Alembic)
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Función que se ejecuta al iniciar (startup) y al cerrar (shutdown) la aplicación.
    """
    print("Aplicación FastAPI iniciando...")

    # Lógica de arranque (startup)
    # Dar un pequeño respiro para asegurar que la DB esté completamente lista, si fuera necesario
    # time.sleep(1)

    db: Session = SessionLocal()
    try:
        # Comprobar si ya hay categorías
        if db.query(models.Category).count() == 0:
            print("Base de datos de categorías vacía. Poblando con datos iniciales...")

            initial_categories = [
                {'category_name': 'Ingreso - Salario'},
                {'category_name': 'Ingreso - Inversiones'},
                {'category_name': 'Gasto - Alimentos'},
                {'category_name': 'Gasto - Vivienda'},
                {'category_name': 'Gasto - Transporte'},
                {'category_name': 'Gasto - Ocio'},
                {'category_name': 'Gasto - Salud'},
                {'category_name': 'Gasto - Educación'},
                {'category_name': 'Gasto - Ahorro'}
            ]

            for cat_data in initial_categories:
                db.add(models.Category(**cat_data))

            db.commit()
            print("Categorías iniciales creadas con éxito.")
        else:
            print(
                "La base de datos de categorías ya contiene datos. No se requiere ninguna acción.")

    finally:
        db.close()

    print("Startup completo. La aplicación está lista para servir peticiones.")
    yield  # Aquí la aplicación empieza a recibir peticiones
    print("Aplicación FastAPI cerrándose...")

app = FastAPI(
    title="MyFiance API",
    description="Backend para la aplicación de gestión de finanzas personales MyFiance.",
    version="0.1.0",
    lifespan=lifespan
)

# Configurar CORS
origins = [
    "http://localhost:3000",
    "https://my-fiance-a6ae.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,         
    allow_origins=origins,  # Lista de orígenes permitidos
    allow_credentials=True, # Permitir cookies
    allow_methods=["*"],    # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],    # Permitir todos los headers
)

# Incluye los routers en la aplicación principal
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(categories.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de MyFiance"}