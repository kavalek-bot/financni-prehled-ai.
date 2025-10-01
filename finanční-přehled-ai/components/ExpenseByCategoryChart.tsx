
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExpenseByCategoryChartProps {
    data: { name: string; value: number }[];
    onCategoryClick: (category: string) => void;
}

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#fde68a', '#fcd34d', '#fbbf24'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border rounded shadow-sm">
                {`${payload[0].name}: ${payload[0].value.toLocaleString('cs-CZ')} Kč (${payload[0].payload.percent}%)`}
            </div>
        );
    }
    return null;
};


const ExpenseByCategoryChart: React.FC<ExpenseByCategoryChartProps> = ({ data, onCategoryClick }) => {
    const total = data.reduce((sum, entry) => sum + entry.value, 0);
    const dataWithPercent = data.map(entry => ({
        ...entry,
        percent: total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0
    }));

    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">Žádná data o výdajích pro tento měsíc.</div>
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={dataWithPercent}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        onClick={(d) => onCategoryClick(d.name)}
                        className="cursor-pointer"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{fontSize: "14px"}}
                        formatter={(value) => <span className="text-gray-600">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpenseByCategoryChart;
