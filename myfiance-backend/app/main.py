from fastapi import FastAPI
from app.database import Base, engine
from app.routers import users, transactions, categories

# Crea las tablas en la base de datos si no existen
# (En un entorno de producción, esto se gestiona con Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MyFiance API",
    description="Backend para la aplicación de gestión de finanzas personales MyFiance.",
    version="0.1.0",
)

# Incluye los routers en la aplicación principal
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(categories.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de MyFiance"}