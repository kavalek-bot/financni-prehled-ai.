
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BudgetStatus } from '../types';

interface BudgetStatusChartProps {
    data: BudgetStatus[];
    onCategoryClick: (category: string) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-md shadow-sm">
                <p className="font-bold text-gray-800">{label}</p>
                <p className="text-indigo-600">{`Limit: ${data.limit.toLocaleString('cs-CZ')} Kč`}</p>
                <p className="text-orange-500">{`Utraceno: ${data.spent.toLocaleString('cs-CZ')} Kč`}</p>
                <p className={`font-semibold ${data.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {`Zbývá: ${data.remaining.toLocaleString('cs-CZ')} Kč`}
                </p>
            </div>
        );
    }
    return null;
};

const BudgetStatusChart: React.FC<BudgetStatusChartProps> = ({ data, onCategoryClick }) => {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Bar dataKey="limit" name="Limit" fill="#818cf8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="spent" name="Utraceno" fill="#f97316" radius={[4, 4, 0, 0]} onClick={(d) => onCategoryClick(d.category)} className="cursor-pointer">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.status === 'Překročeno' ? '#ef4444' : '#f97316'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BudgetStatusChart;
