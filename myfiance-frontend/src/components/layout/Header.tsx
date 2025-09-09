'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ConfirmationModal from '../ui/ConfirmationModal';

interface HeaderProps {
    title: string;
    onAddTransaction: () => void;
}

/**
 * Componente de cabecera para las páginas interiores de la aplicación.
 * Muestra un título y los botones de acción principales.
 */
export default function Header({ title, onAddTransaction }: HeaderProps) {
    const router = useRouter();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    /**
     * Cierra la sesión del usuario eliminando el token y redirigiendo al login.
     */
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        router.push('/');
    };

    return (
        <>
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-dark">
                    {title}
                </h1>
                <div className='flex items-center gap-4'>
                    <button
                        onClick={onAddTransaction}
                        className='bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors'
                    >
                        Añadir Transacción
                    </button>
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className='bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors'
                    >
                        Cerrar sesión
                    </button>
                </div>
            </header>
            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title='Confirmar Cierre de Sesión'
                message='¿Estás seguro de que quieres cerrar la sesión?'
            />
        </>
        
    );
}