
import React from 'react';
import { Transaction } from '../types';

interface TransactionListProps {
    category: string;
    transactions: Transaction[];
    onClose: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ category, transactions, onClose }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Transakce v kategorii: <span className="text-indigo-600">{category}</span></h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popis</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Částka</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map(t => (
                                <tr key={t.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(t.date).toLocaleDateString('cs-CZ')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right font-medium">{formatCurrency(t.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 py-4">Pro tuto kategorii nebyly nalezeny žádné transakce.</p>
            )}
        </div>
    );
};

export default TransactionList;
