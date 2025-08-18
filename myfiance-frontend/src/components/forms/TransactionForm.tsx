// En src/components/forms/TransactionForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { getCategories, createTransaction } from '@/services/api';

/**
 * Formulario para crear una nueva transacción.
 * Obtiene las categorías de la API y notifica al componente padre
 * cuando una transacción ha sido creada con éxito.
 * @param {object} props - Propiedades del componente.
 * @param {() = void} props.onTransactionCreated - Callback para ejecutar tras crear una transacción.
 */
export default function TransactionForm({ onTransactionCreated }: { onTransactionCreated: () => void; }) {
    // Estado unificado para los datos del formulario
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        transaction_date: '',
        category_id: '',
        type: 'expense', // 'expense' por defecto
    });

    // Estado para almacenar la lista de categorías obtenidas de la API
    const [categories, setCategories] = useState([]);
    // Estado para mostrar mensajes de error del formulario
    const [error, setError] = useState('');

    // useEffect se ejecuta una vez para obtener las categorías cuando el componente se carga
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('No se pudieron cargar las categorías:', error);
                setError('No se pudieron cargar las categorías. Inténtalo de nuevo.');
            }
        };
        fetchCategories();
    }, []); // El array vacío asegura que solo se ejecute al montar el componente

    // Manejador genérico para actualizar el estado del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    /**
     * Maneja el envío del formulario.
     * Llama a la API para crear la transacción y notifica al componente padre.
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            await createTransaction(formData);

            // Limpiamos el formulario para la siguiente entrada
            setFormData({
                amount: '',
                description: '',
                transaction_date: '',
                category_id: '',
                type: 'expense',
            });

            // Notificamos al Dashboard que se ha creado una transacción para que pueda recargar la lista
            onTransactionCreated();

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold mb-4">Añadir Nueva Transacción</h2>

            {/* Área para mostrar errores del formulario */}
            {error && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Fila para Tipo y Monto */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monto</label>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            placeholder="0.00"
                        />
                    </div>
                    <fieldset className="flex items-center gap-4 mt-1">
                        <legend className="block text-sm font-medium text-gray-700 mb-1">Tipo</legend>
                        <div className="flex items-center">
                            <input
                                id="expense"
                                name="type"
                                type="radio"
                                value="expense"
                                checked={formData.type === 'expense'}
                                onChange={handleChange}
                                className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                            />
                            <label htmlFor="expense" className="ml-2 block text-sm text-gray-900">Gasto</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="income"
                                name="type"
                                type="radio"
                                value="income"
                                checked={formData.type === "income"}
                                onChange={handleChange}
                                className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                            />
                            <label htmlFor="income" className="ml-2 block text-sm text-gray-900">Ingreso</label>
                        </div>
                    </fieldset>
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Fila para Fecha y Categoría */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700">Fecha</label>
                        <input
                            type="date"
                            name="transaction_date"
                            id="transaction_date"
                            value={formData.transaction_date}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Categoría</label>
                        <select
                            name="category_id"
                            id="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="" disabled>Selecciona una categoría</option>
                            {/* Rellenamos el desplegable dinámicamente con las categorías de la API */}
                            {categories.map((cat: any) => (
                                <option key={cat.category_id} value={cat.category_id}>
                                    {cat.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700">
                    Añadir Transacción
                </button>
            </form>
        </div>
    );
}