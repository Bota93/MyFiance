// Definimos la URL base de nuestra API de FastAPI
const BASE_URL = 'http://localhost:8000';

/**
 * Función para registrar un nuevo usuario.
 * @param userData - Objeto con el email y la contraseña del usuario.
 * @returns La respuesta de la API con los datos del usuario creado
 */
export const registerUser = async (userData: any) => {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        // Si la respuesta no es exitosa, lanzamos un error
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar el usuario');
    }

    return response.json();
};

/**
 * Función para iniciar sesión.
 * @param loginData - Objeto con el username (email) y la contraseña.
 * @returns La respuesta de la API con el access_token
 */
export const loginUser = async (loginData: any) => {
    // El endpoint /token de FastAPI espera datos de formulario, no JSON.
    // Por eso usamos URLSearchParams para formatear el cuerpo de la petición.
    const formData = new URLSearchParams();
    formData.append('username', loginData.username);
    formData.append('password', loginData.password);

    const response = await fetch(`${BASE_URL}/users/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Email o contraseña incorrectos');
    }

    return response.json();
};