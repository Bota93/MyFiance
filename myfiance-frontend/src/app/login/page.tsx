'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/api';

/**
 * Componente de la página para el inicio de sesión de usuarios existentes.
 * Muestra un formulario y lo conecta a la API para autenticar,
 * guarda el token JWT en el navegador y redirige al dashboard.
 * @returns {JSX.Element} El formulario de inicio de sesión.
 */
export default function LoginPage() {
    // Estados para los campos del formulario y mensajes de error
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    /**
     * Maneja el envío del formulario de inicio de sesión.
     * Llama a la API, guarda el token en localStorage y redirige al usuario.
     * @param {React.FormEvent<HTMLFormElement>} e - El evento del formulario
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        
        try {
            const data = await loginUser({ username: email, password: password});

            if (data.access_token) {
                localStorage.setItem('authToken', data.access_token);
                router.push ('/dashboard');
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <main className='flex min-h-screen flex-col items-center justify-center bg-gray-100'>
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className='text-4xl font-bold mb-8 text-center text-gray-800'>
                    Iniciar Sesión
                </h1>

                {error && (
                    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder='tu@email.com'
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='password'
                            className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder='••••••••'
                        />
                    </div>

                    <button
                        type="submit"
                        className='w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors'
                    >
                        Iniciar Sesión
                    </button>
                </form>

                <p className='text-center text-sm text-gray-600 mt-4'>
                    ¿No tienes una cuenta?{' '}
                    <Link href="/register" className='font-medium text-blue-600 hover:underline'>
                        Regístrate aquí
                    </Link>
                </p>

            </div>
        </main>
    )
}