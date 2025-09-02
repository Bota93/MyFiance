'use client';

import { useState, useEffect } from 'react';
import { getCategories } from '@/services/api';

// Definimos los tipos para las props que el componente recibirá
interface TransactionFormProps {
    transactionToEdit?: any; // La transacción a editar (opcional)
    onSubmit: (formData: any) => Promise<void>; // Función a ejecutar al enviar
    onCancel: () => void; // Función para el botón de cancelar
}

/**
 * Formulario controlado y reutilizable para crear o editar una transacción.
 * Se adapta automáticamente si recibe una transacción para editar.
 * Carga las categorías de la API y notifica al componente padre sobre el envío o cancelación.
 * @param {TransactionFormProps} props - Las propiedades del componente. 
 * @returns 
 */
export default function TransactionForm({ transactionToEdit, onSubmit, onCancel }: TransactionFormProps) {
    // Estado unificado para todos los campos del formulario
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        transaction_date: '',
        category_id: '',
        type: 'expense',
    });

    // Estado para la lista de categorías cargadas desde la API
    const [categories, setCategories] = useState([]);
    // Estado para mostrar errores relacionados con el envío del formulario.
    const [error, setError] = useState('');
    const isEditMode = !!transactionToEdit; // Variable para saber si estamos en modo edición

    /**
     * Efecto que se ejecuta cuando el componente está en modo "edición".
     * Rellena los campos del formulario con los datos de la transacción existente.
     */
    useEffect(() => {
        if (isEditMode) {
            setFormData({
                amount: transactionToEdit.amount,
                description: transactionToEdit.description,
                // El formato de fecha de la DB (YYYY-MM-DD) es compatible con el input type="date"
                transaction_date: transactionToEdit.transaction_date,
                category_id: transactionToEdit.category.category_id,
                type: transactionToEdit.type,
            });
        }
    }, [transactionToEdit, isEditMode]);

    /**
     * Efecto que se ejecuta una sola vez al montar el componente para obtener
     * la lisa de categorías desde la API y poblar el desplegable.
     */
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('No se pudieron cargar las categorías:', error);
            }
        };
        fetchCategories();
    }, []);

    /**
     * Manejador genérico que actualiza el estado del formulario
     * cada vez que el usuario escribe en un campo.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    /**
     * Maneja el evento de envío del formulario.
     * Llama a la función 'onSubmit' proporcionada por el componente padre
     * y maneja los posibles errores.
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            await onSubmit(formData);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="p-1">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {isEditMode ? 'Editar Transacción' : 'Añadir Nueva Transacción'}
            </h2>

            {error && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monto</label>
                        <input type="number" name="amount" id="amount" step="0.01" value={formData.amount} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md" placeholder="0.00" />
                    </div>
                    <fieldset className="flex items-center gap-4 sm:mt-6">
                        <legend className="block text-sm font-medium text-gray-700 mb-1 sm:hidden">Tipo</legend>
                        <div className="flex items-center">
                            <input id="expense" name="type" type="radio" value="expense" checked={formData.type === 'expense'} onChange={handleChange} className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500" />
                            <label htmlFor="expense" className="ml-2 block text-sm text-gray-900">Gasto</label>
                        </div>
                        <div className="flex items-center">
                            <input id="income" name="type" type="radio" value="income" checked={formData.type === "income"} onChange={handleChange} className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" />
                            <label htmlFor="income" className="ml-2 block text-sm text-gray-900">Ingreso</label>
                        </div>
                    </fieldset>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                    <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700">Fecha</label>
                        <input type="date" name="transaction_date" id="transaction_date" value={formData.transaction_date} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Categoría</label>
                        <select name="category_id" id="category_id" value={formData.category_id} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                            <option value="" disabled>Selecciona una categoría</option>
                            {categories.map((cat: any) => (<option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="w-full bg-gray-200 text-gray-800 p-3 rounded-md font-semibold hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700">
                        {isEditMode ? 'Guardar Cambios' : 'Añadir Transacción'}
                    </button>
                </div>
            </form>
        </div>
    );
}