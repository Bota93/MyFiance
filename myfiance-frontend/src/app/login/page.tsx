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
    /** @state Almacena el valor del campo de email. */
    const [email, setEmail] = useState('');
    /** @state Almacena el valor del campo de contraseña. */
    const [password, setPassword] = useState('');
    /** @state Guarda el mensaje de error en caso de fallo en el login. */
    const [error, setError] = useState('');
    /** @state Controla el estado de carga para deshabilitar botones y mostrar feedback. */
    const [isLoading, setIsLoading] = useState(false);
    /** @hook Hook de Next.js para gestionar la navegación programática. */
    const router = useRouter();

    /**
     * Maneja el envío del formulario de login estándar.
     * Previene el comportamiento por defecto, lo llama a la API con los datos del estado
     * y gestiona la respuesta o el error.
     * @param {React.FormEvent<HTMLFormElement>} e - El evento del formulario
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const data = await loginUser({ username: email, password: password });

            if (data.access_token) {
                localStorage.setItem('authToken', data.access_token);
                router.push('/dashboard');
            }
        } catch (err) {
            const error = err as Error;
            setError(error.message);
        }
    };

    /**
     * Maneja el login para el usuario de demostración.
     * Utiliza credeciales predefinidas para facilitar el acceso a reclutadores.
     * @param {string} emailToLogin - El email del usuario demo
     * @param {string} passwordToLogin - La contraseña del usuario demo-
     */
    const handleLogin = async (emailToLogin: string, passwordToLogin: string) => {
        setIsLoading(true);
        setError('');
        try {
            const data = await loginUser({ username: emailToLogin, password: passwordToLogin });

            if (data.access_token) {
                localStorage.setItem('authToken', data.access_token);
                router.push('/dashboard');
            }
        } catch (err) {
            const error = err as Error;
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className='min-h-screen flex bg-white'>
            {/* --- Sección del formulario (izquierda) --- */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
                <div className='w-full max-w-md'>
                    <h1 className='text-4xl font-bold mb-4 text-center text-gray-800'>
                        Iniciar Sesión
                    </h1>
                    <p className='text-center text-gray-500 mb-8'>
                        Bienvenido a MyFiance
                    </p>

                    {error && (
                        <div className='bg-red.100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4' role="alert">
                            <span className='block sm:inline'>{error}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        <div>
                            <label
                                htmlFor='email'
                                className='block text-sm font-medium text-gra-700 mb-1'
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
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
                                className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                placeholder="••••••••"
                            />
                        </div>

                        <div className='flex flex-col gap-3 mt-2'>
                            <button
                                type="submit"
                                className='w-full bg-indigo-600 text-white p-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            >
                                Iniciar Sesión
                            </button>

                            <button
                                type='button'
                                disabled={isLoading}
                                onClick={() => handleLogin('demo@example.com', 'demopassword')}
                                className='w-full bg-gray-100 text-gray-700 p-3 rounded-md font-semibold hover:bg-gray-200 border border-gray-300 transition-colors disabled:opacity-50 disabled:cursos-not-allowed'
                            >
                                {isLoading ? 'Iniciando...' : 'Entrar como Invitado (Demo)'}
                            </button>
                        </div>
                    </form>

                    <p className='text-center text-sm text-gray-600 mt-6'>
                        ¿No tienes cuenta?{' '}
                        <Link href="/register" className='font-medium text-indigo-600 hover:text-indigo-500'>
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>

            {/* --- Sección Visual (Derecha) --- */}
            <div className='hidder lg:flex w-1/2 items-center justify-center bg-indigo-50 p-12'>
                <div className='text-center'>
                    <img
                        src="/illustration/fondo.png"
                        alt="Ilustración de una persona gestionando sus finanzas"
                        className='max-w-md mx-auto'
                    />
                    <h2 className='text-3xl font-bold text-gray-800 mt-8'>
                        Toma el control de tu dinero
                    </h2>
                    <p className='text-gray-600 mt-3 max-w-sm mx-auto'>
                        MyFiance te ayuda a visualizar tus finanzas de una forma clara, sencilla e intuitiva.
                    </p>
                </div>
            </div>
        </main>
    );
}