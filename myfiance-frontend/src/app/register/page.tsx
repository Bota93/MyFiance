'use client';

import { useState } from "react";
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
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
                    Crear una cuenta
                </h1>

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-mb focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-y-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-mb font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Registrar
                    </button>
                </form>
            </div>
        </main>
    );
}