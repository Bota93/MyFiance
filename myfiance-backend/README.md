# Backend de MyFiance (API con FastAPI)

Este directorio contiene el código fuente del backend para la aplicación MyFiance. La API está construida con FastAPI y se encarga de toda la lógica de negocio, autenticación y comunicación con la base de datos PostgreSQL.

## 🛠️ Tecnologías Principales

* **Framework:** FastAPI
* **Servidor ASGI:** Uvicorn
* **ORM:** SQLAlchemy
* **Driver de Base de Datos:** Psycopg2
* **Autenticación:** Passlib (con bcrypt), Python-JOSE (JWT)
* **Validación:** Pydantic
* **Variables de Entorno:** Python-dotenv

---
## 🚀 Puesta en Marcha

### 1. Prerrequisitos
* Python 3.10+
* PostgreSQL instalado y corriendo.
* Haber clonado el repositorio principal.

### 2. Configuración (desde la carpeta `backend/`)

1.  **Crea y activa el entorno virtual:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

2.  **Instala las dependencias:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configura las variables de entorno:**
    * Crea un archivo `.env` en este directorio (`backend/`).
    * Añade las siguientes variables con tus datos:
        ```ini
        DB_USER="tu_usuario_postgres"
        DB_PASSWORD="tu_contraseña_postgres"
        DB_HOST="localhost"
        DB_NAME="myfiance_db" # La base de datos debe estar creada
        DB_PORT="5432"
        SECRET_KEY="tu_clave_secreta_generada_con_openssl"
        ```

### 3. Ejecución

* Para iniciar el servidor, navega a la **carpeta raíz del proyecto** (`MyFiance/`) y ejecuta:
    ```bash
    python backend/run.py
    ```
* La API estará disponible en `http://127.0.0.1:8000`.
* La documentación interactiva se encuentra en `http://127.0.0.1:8000/docs`.

---
## 📡 Endpoints de la API

### Users (`/users`)
* `POST /users/register`: Registra un nuevo usuario.
* `POST /users/token`: Inicia sesión y devuelve un token JWT.

### Transactions (`/transactions`)
* `POST /transactions/`: Crea una nueva transacción (requiere autenticación).
* `GET /transactions/`: Obtiene la lista de transacciones del usuario autenticado (requiere autenticación).

### Categories (`/categories`)
* `GET /categories/`: Obtiene la lista de todas las categorías disponibles.