'use client';

import { useEffect, useState, useCallback } from "react";
import withAuth from "@/components/auth/withAuth";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "@/services/api";
import TransactionForm from "@/components/forms/TransactionForm";
import Modal from "@/components/ui/Modal";
import Header from "@/components/layout/Header";

// CORRECCIÓN 1: Interfaz actualizada para incluir 'category'
interface Transaction {
    transaction_id: number;
    description: string;
    transaction_date: string;
    amount: number;
    type: 'income' | 'expense';
    category: { // La API devuelve un objeto 'category'
        category_id: number;
        category_name: string;
    };
}

// Este tipo describe los datos que el formulario envía a la API
type TransactionFormData = {
    amount: number;
    description: string;
    transaction_date: string;
    type: 'income' | 'expense';
    category_id: number;
}

function DashboardPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const fetchTransactions = useCallback(async () => {
        try {
            if (!isLoading) setIsLoading(true);
            const data = await getTransactions();
            setTransactions(data);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Ocurrió un error inesperado.');
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleDelete = async (transactionId: number) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
            return;
        }
        try {
            await deleteTransaction(transactionId);
            setTransactions(current => current.filter(tx => tx.transaction_id !== transactionId));
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'No se pudo eliminar la transacción.');
        }
    };

    const handleCreateSubmit = async (formData: TransactionFormData) => {
        try {
            await createTransaction(formData);
            fetchTransactions();
            setIsCreateModalOpen(false);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'No se pudo crear la transacción.');
        }
    };

    const handleUpdateSubmit = async (formData: TransactionFormData) => {
        if (!editingTransaction) return;
        try {
            await updateTransaction(editingTransaction.transaction_id, formData);
            fetchTransactions();
            setIsEditModalOpen(false);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'No se pudo actualizar la transacción.');
        }
    };

    if (isLoading) return <p className="p-8 text-center">Cargando...</p>;
    if (error) return <p className="p-8 text-center text-red-500">Error: {error}</p>;

    return (
        <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <Header
                    title="Mi Dashboard"
                    onAddTransaction={() => setIsCreateModalOpen(true)}
                />

                <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                    <TransactionForm onSubmit={handleCreateSubmit} onCancel={() => setIsCreateModalOpen(false)} />
                </Modal>

                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <TransactionForm
                        onSubmit={handleUpdateSubmit}
                        onCancel={() => setIsEditModalOpen(false)}
                        transactionToEdit={editingTransaction}
                    />
                </Modal>

                <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Últimas Transacciones</h2>
                    {transactions.length === 0 ? (
                        <p className="text-gray-500">No tienes transacciones todavía.</p>
                    ) : (
                        <ul>
                            {transactions.map((tx) => (
                                <li key={tx.transaction_id} className="flex justify-between items-center border-b py-3 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                                    <div>
                                        <p className="font-medium text-gray-900">{tx.description}</p>
                                        {/* CORRECCIÓN 2: Formatear la fecha para que sea legible */}
                                        <p className="text-sm text-gray-500">{new Date(tx.transaction_date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'income' ? '+' : '-'} {tx.amount} €
                                        </p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => { setEditingTransaction(tx); setIsEditModalOpen(true); }}
                                                className="flex items-center gap-1 text-sm text-blue-600 hover:bg-blue-100 hover:text-blue-800 hover:font-semibold px-2 py-1 rounded-md transition-all duration-150"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tx.transaction_id)}
                                                className="flex items-center gap-1 text-sm text-red-600 hover:bg-red-100 hover:text-red-800 hover:font-semibold px-2 py-1 rounded-md transition-all duration-150"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
}

export default withAuth(DashboardPage);