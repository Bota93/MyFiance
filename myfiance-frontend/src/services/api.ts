// --- (Interfaces y Tipos - Sin cambios) ---
interface Category {
  category_id: number;
  category_name: string;
}
interface Transaction {
  transaction_id: number;
  description: string;
  transaction_date: string;
  amount: number;
  type: 'income' | 'expense';
  category: Category;
}
type TransactionSubmitData = {
  amount: number;
  description: string;
  transaction_date: string;
  category_id: number;
  type: 'income' | 'expense';
}
interface UserData {
    email: string;
    password?: string;
}
interface LoginData {
    username: string;
    password?: string;
}
interface TokenResponse {
    access_token: string;
    token_type: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// --- apiFetch (Simplificado) ---
// Esta función ahora solo añade el token de autorización.
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  // Clonamos los headers para no modificar el objeto original
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
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

// --- Funciones de la API (Corregidas) ---

export const registerUser = (userData: UserData): Promise<UserData> => {
    return apiFetch('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData), // Convertimos aquí
    });
};

export const loginUser = async (loginData: LoginData): Promise<TokenResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', loginData.username);
    if (loginData.password) {
        formData.append('password', loginData.password);
    }
    
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

export const getCategories = (): Promise<Category[]> => apiFetch('/categories/');

export const getTransactions = (): Promise<Transaction[]> => apiFetch('/transactions/');

export const createTransaction = (transactionData: TransactionSubmitData): Promise<Transaction> => {
  return apiFetch('/transactions/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData), // Convertimos aquí
  });
};

export const deleteTransaction = (transactionId: number): Promise<boolean> => {
  return apiFetch(`/transactions/${transactionId}`, {
    method: 'DELETE',
  });
};

export const updateTransaction = (transactionId: number, transactionData: TransactionSubmitData): Promise<Transaction> => {
  return apiFetch(`/transactions/${transactionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData), // Convertimos aquí
  });
};