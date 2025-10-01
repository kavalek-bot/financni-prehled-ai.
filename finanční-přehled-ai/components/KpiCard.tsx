
import React from 'react';

interface KpiCardProps {
    title: string;
    value: number;
    type: 'income' | 'expense' | 'balance';
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, type }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(amount);
    };

    const colors = {
        income: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01'
        },
        expense: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            icon: 'M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        balance: {
            bg: 'bg-indigo-100',
            text: 'text-indigo-800',
            icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2'
        }
    };
    
    const balanceColor = value >= 0 ? 'text-green-600' : 'text-red-600';

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
            <div className={`p-3 rounded-full ${colors[type].bg}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${colors[type].text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={colors[type].icon} />
                </svg>
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className={`text-2xl font-bold ${type === 'balance' ? balanceColor : colors[type].text}`}>
                    {formatCurrency(value)}
                </p>
            </div>
        </div>
    );
};

export default KpiCard;
