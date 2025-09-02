# MyFiance: Aplicación Full-Stack de Finanzas Personales

## 🎯 Objetivo
El objetivo de la aplicación es capacitar a las familias para tomar mejores decisiones financieras, ofreciendo una herramienta de control de gastos sencilla, clara e intuitiva. No se espera que el usuario tenga conocimientos informáticos avanzados.


---
## ✨ Características Principales

* **Autenticación Segura:** Sistema de registro y login basado en tokens JWT para garantizar la privacidad de los datos.
* **Gestión CRUD Completa:** Funcionalidad completa para Crear, Leer, Actualizar y Eliminar transacciones (ingresos y gastos).
* **"Modo Demo" para Reclutadores:** Un usuario de prueba (`demo@example.com`) cuyos datos se resetean en cada login para una demostración fácil y limpia.
* **Arquitectura Profesional:** Backend construido con una estructura modular y escalable (routers, crud, modelos) y Frontend con una arquitectura de componentes reutilizables.
* **Base de Datos Relacional:** Uso de SQLAlchemy como ORM para interactuar con una base de datos PostgreSQL.
* **Documentación de API Interactiva:** API completamente documentada y lista para probar gracias a Swagger UI (`/docs`).

---
## 🛠️ Tecnologías Utilizadas

| Área          | Tecnologías                                       |
| :------------ | :------------------------------------------------ |
| **Backend** | Python, FastAPI, SQLAlchemy, Uvicorn              |
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS          |
| **Base de Datos** | PostgreSQL                                        |
| **Autenticación** | Passlib (con bcrypt), Python-JOSE (para JWT)      |
| **DevOps** | Git, GitHub, Entornos Virtuales, AWS (futuro)     |

---
## 📂 Estructura del Proyecto (Monorepo)
Este repositorio contiene el proyecto completo en una estructura de monorepo:
* `/backend`: Contiene todo el código fuente de la API de FastAPI.
* `/frontend`: Contiene el código fuente de la interfaz de usuario con Next.js.

---
## 🚀 Puesta en Marcha (Entorno Local)

Sigue estos pasos para levantar el proyecto completo.

### **1. Prerrequisitos**
* Python 3.10+
* Node.js 18+
* PostgreSQL instalado y un servidor corriendo.

### **2. Configuración del Backend**

1.  **Navega a la carpeta del backend y activa el entorno virtual:**
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    ```

2.  **Instala las dependencias del backend:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configura las variables de entorno del backend:**
    * Dentro de `backend/`, crea un archivo `.env`.
    * Copia el siguiente contenido y reemplaza los valores con tus credenciales:
        ```ini
        DB_USER="tu_usuario_postgres"
        DB_PASSWORD="tu_contraseña_postgres"
        DB_HOST="localhost"
        DB_NAME="myfiance_db" # Asegúrate de haber creado esta base de datos
        DB_PORT="5432"
        SECRET_KEY="una_clave_secreta_muy_larga_generada_con_openssl"
        ```

4.  **Inicia el servidor del backend:**
    * Abre una **nueva terminal** en la raíz del proyecto (`MyFiance/`) y ejecuta:
        ```bash
        python backend/run.py
        ```
    * La API estará disponible en `http://127.0.0.1:8000`.

### **3. Configuración del Frontend**

1.  **Navega a la carpeta del frontend e instala las dependencias:**
    * Abre **otra terminal** y desde la raíz del proyecto (`MyFiance/`) ejecuta:
        ```bash
        cd frontend
        npm install
        ```

2.  **Inicia el servidor del frontend:**
    * En la misma terminal, ejecuta:
        ```bash
        npm run dev
        ```
    * La aplicación web estará disponible en `http://localhost:3000`.

### **4. Probar la Aplicación (Modo Demo)**
* Abre `http://localhost:3000` en tu navegador.
* Ve a la página de **Login**.
* Usa las siguientes credenciales para una demostración:
    * **Email:** `demo@example.com`
    * **Password:** `demopassword`
* Cada vez que inicies sesión con este usuario, los datos se resetearán a un estado de ejemplo.
