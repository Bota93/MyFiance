# MyFiance: Aplicación Full-Stack de Finanzas Personales

## 🎯 Objetivo
El objetivo de la aplicación es capacitar a las familias para tomar mejores decisiones financieras, ofreciendo una herramienta de control de gastos sencilla, clara e intuitiva. No se espera que el usuario tenga conocimientos informáticos avanzados.


---
## ✨ Características Principales

* **Autenticación Segura:** Creación de cuentas de usuario seguras con email y contraseña para garantizar la privacidad de los datos.
* **Gestión de Transacciones:** Registro de nuevos ingresos y gastos con monto, fecha, descripción y categoría.
* **Visualización de Historial:** Lista de transacciones pasadas para tener un historial completo de los movimientos financieros.
* **Categorización Clara:** Organización de gastos e ingresos por categorías (alimentación, transporte, ocio, etc.) para entender los patrones de gasto.
* **API Bien Estructurada:** El backend está construido con una arquitectura profesional, modular y escalable.
* **Documentación Interactiva:** La API es autodescriptiva y se puede probar directamente desde el navegador en la ruta `/docs`.

---
## 🛠️ Tecnologías Utilizadas

| Área | Tecnologías |
| :--- | :--- |
| **Backend** | Python, FastAPI, SQLAlchemy, Uvicorn |
| **Base de Datos** | PostgreSQL |
| **Autenticación** | Passlib (con bcrypt), Python-JOSE (para JWT) |
| **Validación** | Pydantic |
| **Frontend** | Next.js, React, TypeScript *(próximamente)* |

---
## 📂 Estructura del Proyecto (Monorepo)
Este repositorio contiene el proyecto completo en una estructura de monorepo:
* `/backend`: Contiene todo el código fuente de la API de FastAPI.
* `/frontend`: Contendrá el futuro desarrollo de la interfaz de usuario con Next.js.

---
## 🚀 Puesta en Marcha (Backend)

Sigue estos pasos para levantar el servicio del backend en un entorno local.

1.  **Navega a la carpeta del backend:**
    ```bash
    cd backend
    ```

2.  **Crea y activa el entorno virtual:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Instala las dependencias:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configura las variables de entorno:**
    * Dentro de la carpeta `backend`, crea un archivo llamado `.env`.
    * Copia el siguiente contenido y reemplaza los valores con tus credenciales:
        ```ini
        DB_USER="tu_usuario_postgres"
        DB_PASSWORD="tu_contraseña_postgres"
        DB_HOST="localhost"
        DB_NAME="myfiance_db" # Asegúrate de haber creado esta base de datos
        DB_PORT="5432"
        SECRET_KEY="una_clave_secreta_muy_larga_generada_con_openssl"
        ```

5.  **Ejecuta la aplicación:**
    * Desde la carpeta **raíz del proyecto** (`MyFiance/`), ejecuta:
        ```bash
        python backend/run.py
        ```
    * La API estará disponible en `http://127.0.0.1:8000`.

---
## 🗺️ RoadMap (Planes a Futuro)

* **Fase 2:** Integración de datos macroeconómicos (inflación, PIB) para un análisis contextualizado.
* **Fase 3:** Desarrollo de un modelo predictivo con IA para sugerencias personalizadas de ahorro.