const BASE_URL = 'http://localhost:8000';

/**
 * Obtiene el toke de autenticación del localStorage
 * @returns {string | null} El token JWT o null si no se encuentra
 */
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

/**
 * Función centralizada ("interceptor") para todas las llamadas a la API.
 * Construye las cabeceras, añade el token de autenticación si existe,
 * y maneja globalmente los errores de sesión (401 Unauthorized) redirigiendo al login.
 * @param {string} endpoint - La ruta de la API a la que llamar.
 * @param {RequestInit} [options={}] - Opciones estándar de la API Fetch (method, body, etc.).
 * @returns {Promise<any>} La respuesta JSON de la API.
 * @throws {Error} Lanza un error si la petición falla o la sesión expira.
 */
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Si el cuerpo de la petición es un objeto, lo convertimos a JSON.
  if (options.body && typeof options.body !== 'string') {
      headers.set('Content-Type', 'application/json');
      options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor, inicia sesión de nuevo.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Error en el servidor' }));
    throw new Error(errorData.detail || 'Ocurrió un error.');
  }

  if (response.status === 204) {
    return true;
  }

  return response.json();
};

// --- Funciones de la API (Ahora más simples) ---

/**
 * Registra un nuevo usuario
 * @param {object} userData - Datos del usuario (email, password).
 * @returns {Promise<any>} El objeto del usuario creado.
 */
export const registerUser = (userData: any) => {
    return apiFetch('/users/register', {
        method: 'POST',
        body: userData,
    });
};

/**
 * Autentica a un usuario y obtiene un token de acceso
 * @param {object} loginData - Credenciales del usuario (username, password).
 * @returns {Promise<any>} Un objeto con el access_token
 */
export const loginUser = async (loginData: any) => {
    const formData = new URLSearchParams();
    formData.append('username', loginData.username);
    formData.append('password', loginData.password);
    
    const response = await fetch(`${BASE_URL}/users/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Email o contraseña incorrectos');
    }
    return response.json();
};

/**
 * Obtiene la lista completa de categorías.
 * @returns {Promise<any>} Un array de objetos de categoría.
 */
export const getCategories = () => apiFetch('/categories/');

/**
 * Obtiene las transacciones del usuario autenticado.
 * @returns {Promise<any>} Un array de objetos de transacción
 */
export const getTransactions = () => apiFetch('/transactions/');

/**
 * Crea una nueva transacción para el usuario autenticado.
 * @param {object} transactionData - Los datos de la nueva transacción
 * @returns {Promise<any>} El objeto de la transacción creada
 */
export const createTransaction = (transactionData: any) => {
  return apiFetch('/transactions/', {
    method: 'POST',
    body: transactionData,
  });
};

/**
 * Elimina una transacción específica por su ID.
 * @param {number} transactionId - El ID de la transacción a eliminar.
 * @returns {Promise<boolean>} True si la eliminiación fue exitosa
 */
export const deleteTransaction = (transactionId: number) => {
  return apiFetch(`/transactions/${transactionId}`, {
    method: 'DELETE',
  });
};

/**
 * Actualiza una transacción existente.
 * @param {number} transactionId - El ID de la transacción a actualizar.
 * @param {object} transactionData - Los nuevos datos para la transacción.
 * @returns {Promise<any>} El objeto de la transacción actualizada.
 */
export const updateTransaction = (transactionId: number, transactionData: any) => {
  return apiFetch(`/transactions/${transactionId}`, {
    method: 'PUT',
    body: transactionData,
  });
};