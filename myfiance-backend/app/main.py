from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, SessionLocal
from app.routers import users, transactions, categories
from app import models, schemas

# --- Lógica de Arranque para Poblar la Base de Datos ---


def populate_initial_data():
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

            for cat in initial_categories:
                db_category = models.Category(**cat)
                db.add(db_category)

            db.commit()
            print("Categorías iniciales creadas.")
        else:
            print("La base de datos de categorías ya contiene datos.")

    finally:
        db.close()


# Crea las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

# Ejecuta la función de poblado de datos
populate_initial_data()

# --- Configuración de la App FastAPI ---
app = FastAPI(
    title="MyFiance API",
    description="Backend para la aplicación de gestión de finanzas personales MyFiance.",
    version="0.1.0",
)

# Configurar CORS
origins = [
    "http://localhost:3000",
    "https://myfiance-frontend-two.vercel.app"  # URL de tu frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluye los routers en la aplicación principal
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(categories.router)


@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de MyFiance"}
