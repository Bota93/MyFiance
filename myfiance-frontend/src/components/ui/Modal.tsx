'use client'

import { ReactNode } from "react";

/**
 * Define las propiedades (props) que el componente Modal acepta.
 */
interface ModalProps {
    /** Controla si el modal está visible o no. */
    isOpen: boolean;
    /** Función que se ejevuta cuando el usuario cierra el modal.*/
    onClose: () => void;
    /** El contenido (elemento JSX) que se mostrará dentro del modal. */
    children: ReactNode;
}

/**
 * Un componente de Modal genérico y reutilizable.
 * Muestra el contenido en una ventana emergente sobre un fondo oscuro.
 * @param {ModalProps} props - las propiedades para configurar el modal.
 * @returns {JSX.Element | null} EL JSX del modal si isOpen es true ,o null si está cerrado.
 */
export default function Modal({ isOpen, onClose, children }: ModalProps) {
    // Si el modal no debe estar abierto, no renderizamos nada.
    if (!isOpen) return null;

    return (
        // Contenedor principal que ocupa toda la pantalla y oscurece el fondo.
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            {/* Panel del modal que contiene el contenido */}
            <div className="bg-white p-6 rounded-lg shadow-xl relative w-full max-w-lg">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                >
                    &times;
                </button>
                {/* Aquí se renderiza el contenido que se le pasa al modal */}
                {children}
            </div>
        </div>
    );
}