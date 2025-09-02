'use client'

import Modal from './Modal';

/**
 * Define las propiedades (props) que el componente ConfirmationModal acepta.
 */

interface ConfirmationModalProps {
    /** Controla si el modal está visible o no. */
    isOpen: boolean;
    /** Función que se ejecuta cuando el usuario cancela la acción. */
    onClose: () => void;
    /** Función que se ejecuta cuando el usuario confirma la acción. */
    onConfirm: () => void;
    /** El título principal del modal. */
    title: string;
    /** El mensaje o pregunta de confirmación. */
    message: string;
}

/**
 * Un componente reutilizable para mostrar un diálogo de confirmación (Si/No).
 * Se construye sobre el componente Modal base.
 * @param {ConfirmationModalProps} props - Las propiedades para configurar el modal.
 * @returns {JSX.Element | null} El modal de confirmación si isOpen es true, o null si está cerrado.
 */
export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className='text-center'>
                <h2 className='text-2xl font-bold text-black mb-4'>{title}</h2>
                <p className='text-gray-600 mb-6'>{message}</p>
                <div className='flex justify-center gap-4'>
                    <button
                        onClick={onClose}
                        className='px-6 py-2 rounded-md font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors'
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className='px-6 py-2 rounded-md font-semibold bg-red-600 text-white hover:bg-red-800  transition-colors'
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </Modal>
    );
}