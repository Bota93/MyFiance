'use client';

import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import { registerUser } from '@/services/api'; // Importamos la función de la API

/**
 * Componente de página para el registro de nuevos usuarios.
 * Muesta un formulario de email/contraseña, maneja el estado de los campos
 * y se comunica con la API para crear la cuenta.
 * @returns {JSX.Element} El formulario de registro.
 */
export default function RegisterPage() {
    // Estados para guardar el email, la contraseña y los mensajes de error/éxito
    const [email, setEmail] = useState('');
    // Estado para almacenar el valor del campo contraseña
    const [password, setPassword] = useState('');
    // Estado para mostrar el mensaje de error al usuario
    const [error, setError] = useState('');
    // Estado para mostrar el mensaje de éxito al usuario
    const [success, setSuccess] = useState('');

    /**
     * Maneja el envío del formulario de registro.
     * Llama al servicio de API y actualiza el estado del componente
     * para mostrar mensajes de éxito o errores.
     * @param {React.FormEvent<HTMLFormElement>} e - El evento del formulario
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Evita que la página recargue
        setError('');
        setSuccess('');


        try {
            const userData = await registerUser({ email, password });
            setSuccess('¡Usuario registrado con éxito! Ahora puedes iniciar sesión');
            console.log('Usuario creado: ', userData);
            setEmail('');
            setPassword('');
        } catch (err) {
            const error = err as Error;
            setError(error.message);
        }
    };

    return (
        <main className="min-h-screen flex bg-white">
            {/* --- COLUMNA IZQUIERDA (FORMULARIO) --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className='w-full max-w-md'>
                    <h1 className='text-4xl font-bold mb-4 text-center text-gray-800'>
                        Crea tu cuenta
                    </h1>
                    <p className='text-center text-gray-500 mb-8'>
                        Empieza a tomar el control de tus finanzas hoy mismo.
                    </p>

                    {/* Mensajes de éxito y error */}
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4">
                            {error}
                        </div>
                    )}

                    {/* Formulario de Registro */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white p-3 mt-2 rounded-md font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            Crear Cuenta
                        </button>
                    </form>

                    {/* Enlace a la página de login */}
                    <p className='text-center text-sm text-gray-600 mt-6'>
                        ¿Ya tienes una cuenta?{' '}
                        <Link href="/(login)" className='font-medium text-indigo-600 hover:underline'>
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>

            {/* --- COLUMNA DERECHA (VISUAL) --- */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-indigo-50 p-12">
                <div className="text-center">
                    <Image
                                            src="/illustration/fondo_registro.png"
                                            alt="Ilustración de una persona gestionando sus finanzas"
                                            width={500} // El componente Image necesita width y height
                                            height={500}
                                            className='max-w-md h-auto mx-auto' // Tailwind controla el tamaño final
                                            priority // Opcional: Carga esta imagen antes
                                        />
                    <h2 className="text-3xl font-bold text-gray-800 mt-8">
                        Tu primer paso hacia la libertad financiera
                    </h2>
                    <p className="text-gray-600 mt-3 max-w-sm mx-auto">
                        Regístrate en segundos y descubre a dónde va tu dinero realmente.
                    </p>
                </div>
            </div>
        </main>
    );
}