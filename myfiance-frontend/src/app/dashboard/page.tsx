'use client';

import { useEffect, useState } from "react";
import withAuth from "@/components/auth/withAuth";
import { getTransactions } from "@/services/api";

/**
 * Página principal del Dashboard del usuario.
 * Está protegida y solo es accesible para usuarios autenticados.
 * Obtiene y muestra una lista de las transacciones del usuario.
 */
function DashboardPage() {
    // Estado para almacenar la lista de transacciones obtenidas de la API
    const [transactions, setTransactions] = useState([]);
    // Estado para gestionar la visualización del mensaje de carga
    const [isLoading, setIsLoading] = useState(true);
    // Estado para almacenar cualquier error que ocurra durante la obtención de datos
    const [error, setError] = useState('');
    
    // useEffect se ejecuta una vez que el componente se ha montado en el cliente.
    // Es el lugar ideal para hacer llamadas a ApIs para obtener datos iniciales.
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await getTransactions();
                setTransactions(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false); // Oculta el mensaje de carga, da igual si tiene éxito o no
            }
        };

        fetchTransactions();
    }, []); // El array de dependencias está vacío para asegurar que el efecto se ejecute solo una vez

    // Renderizado condicional basado en el estado de la carga
    if (isLoading) {
        return <p className="p-8">Cargando transacciones...</p>
    }

    return (
        <main className="p-4 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-800">
                Mi Dashboard
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4"> Últimas transacciones</h2>
                {transactions.length === 0 ? (
                    <p>No tienes transacciones todavía.</p>
                ) : (
                    <ul>
                        {transactions.map((tx: any) => (
                            <li key={tx.transaction_id} className="flex justify-between items-center border-b py-2">
                                <div>
                                    <p className="font-medium">{tx.description}</p>
                                    <p className="text-sm text-gray-500">{tx.transaction_date}</p>
                                </div>
                                <p className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'income' ? '+' : '-'} {tx.amount} €
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}

export default withAuth(DashboardPage);