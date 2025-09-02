'use client';

import { useState, useEffect } from 'react';
import { getCategories } from '@/services/api';

// --- DEFINICIÓN DE TIPOS E INTERFACES ---

interface Category {
    category_id: number;
    category_name: string;
}

interface Transaction {
    transaction_id: number;
    description: string;
    transaction_date: string;
    amount: number;
    type: 'income' | 'expense';
    category: Category;
}

// Este tipo representa los datos del formulario (los valores son strings)
interface FormDataState {
    amount: string;
    description: string;
    transaction_date: string;
    category_id: string;
    type: 'income' | 'expense';
}

interface SubmitData {
    amount: number;
    description: string;
    transaction_date: string;
    category_id: number;
    type: 'income' | 'expense';
}

interface TransactionFormProps {
    transactionToEdit?: Transaction | null;
    onSubmit: (formData: SubmitData) => Promise<void>;
    onCancel: () => void;
}


export default function TransactionForm({ transactionToEdit, onSubmit, onCancel }: TransactionFormProps) {
    const [formData, setFormData] = useState<FormDataState>({
        amount: '',
        description: '',
        transaction_date: '',
        category_id: '',
        type: 'expense',
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState('');
    const isEditMode = !!transactionToEdit;

    useEffect(() => {
        if (isEditMode && transactionToEdit) {
            setFormData({
                amount: String(transactionToEdit.amount),
                description: transactionToEdit.description,
                transaction_date: transactionToEdit.transaction_date.split('T')[0],
                category_id: String(transactionToEdit.category.category_id),
                type: transactionToEdit.type,
            });
        }
    }, [transactionToEdit, isEditMode]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data: Category[] = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('No se pudieron cargar las categorías:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const dataToSubmit: SubmitData = {
            description: formData.description,
            transaction_date: formData.transaction_date,
            type: formData.type,
            amount: parseFloat(formData.amount),
            category_id: parseInt(formData.category_id, 10),
        };

        if (isNaN(dataToSubmit.amount) || isNaN(dataToSubmit.category_id)) {
            setError('Por favor, introduce un monto y una categoría válidos.');
            return;
        }

        try {
            await onSubmit(dataToSubmit);
        } catch (err) {
            const error = err as Error;
            setError(error.message);
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
                            {categories.map((cat: Category) => (<option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>))}
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