
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlySummary } from '../types';

interface CashflowTrendChartProps {
    data: MonthlySummary[];
}

const CashflowTrendChart: React.FC<CashflowTrendChartProps> = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="month" tick={{ fontSize: 12 }}/>
                    <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} tick={{ fontSize: 12 }} />
                    <Tooltip
                        formatter={(value: number) => [value.toLocaleString('cs-CZ') + ' Kč', '']}
                        labelStyle={{ fontWeight: 'bold' }}
                        itemStyle={{ padding: 0 }}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Line type="monotone" dataKey="income" name="Příjmy" stroke="#22c55e" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="expenses" name="Výdaje" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }}/>
                    <Line type="monotone" dataKey="balance" name="Bilance" stroke="#6366f1" strokeWidth={2} activeDot={{ r: 8 }}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CashflowTrendChart;
