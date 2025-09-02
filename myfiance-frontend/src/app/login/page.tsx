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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const data = await loginUser({ username: email, password: password });

            if (data.access_token) {
                localStorage.setItem('authToken', data.access_token);
                router.push('/dashboard');
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleLogin = async (emailToLogin: string, passwordToLogin: string) => {
        setIsLoading(true);
        setError('');
        try{
            const data = await loginUser({ username: emailToLogin, password: passwordToLogin });

            if (data.access_token) {
                localStorage.setItem('authToken', data.access_token);
                router.push('/dashboard');
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Fondo de la página, puedes cambiar bg-gray-100 por un color neutro de tu paleta si quieres
        <main className='flex min-h-screen flex-col items-center justify-center bg-gray-100'>
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className='text-4xl font-bold mb-8 text-center text-dark'>
                    Iniciar Sesión
                </h1>

                {error && (
                    <div className='bg-red-100 border border-accent-red text-accent-red px-4 py-3 rounded relative mb-4'>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium text-dark mb-1'
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder='tu@email.com'
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='password'
                            className='block text-sm font-medium text-dark mb-1'
                        >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder='••••••••'
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className='w-full bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors'
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            type="button" // Importante: type="button" para no enviar el formulario
                            disabled={isLoading}
                            onClick={() => handleLogin('demo@example.com', 'demopassword')}
                            className='w-full bg-gray-600 text-white p-3 rounded-md font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50'
                        >
                            {isLoading ? 'Iniciando...' : 'Entrar como Invitado (Demo)'}
                        </button>
                    </div>
                    

                </form>

                <p className='text-center text-sm text-gray-600 mt-4'>
                    ¿No tienes una cuenta?{' '}
                    <Link href="/register" className='font-medium text-primary hover:text-accent-green'>
                        Regístrate aquí
                    </Link>
                </p>

            </div>
        </main>
    )
}