
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getTransactions, getBudgets } from '../services/financeService';
import { Transaction, CategoryBudget, MonthlySummary, BudgetStatus } from '../types';
import Header from './Header';
import KpiCard from './KpiCard';
import BudgetStatusChart from './BudgetStatusChart';
import ExpenseByCategoryChart from './ExpenseByCategoryChart';
import CashflowTrendChart from './CashflowTrendChart';
import TransactionList from './TransactionList';
import AiAssistant from './AiAssistant';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

const Dashboard: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentDate, setCurrentDate] = useState(new Date());
    const selectedYear = currentDate.getFullYear();
    const selectedMonth = currentDate.getMonth();

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [transData, budgetData] = await Promise.all([getTransactions(), getBudgets()]);
            setTransactions(transData);
            setBudgets(budgetData);
        } catch (err) {
            setError('Nepodařilo se načíst data. Zkuste to prosím znovu později.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getFullYear() === selectedYear && tDate.getMonth() === selectedMonth;
        });
    }, [transactions, selectedYear, selectedMonth]);
    
    const monthlySummary: MonthlySummary = useMemo(() => {
        const income = filteredTransactions
            .filter(t => t.type === 'Příjem')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = filteredTransactions
            .filter(t => t.type === 'Výdaj')
            .reduce((sum, t) => sum + t.amount, 0);
        
        return {
            month: `${selectedMonth + 1}/${selectedYear}`,
            income,
            expenses,
            balance: income - expenses
        };
    }, [filteredTransactions, selectedMonth, selectedYear]);

    const budgetStatus: BudgetStatus[] = useMemo(() => {
        return budgets.map(budget => {
            const spent = filteredTransactions
                .filter(t => t.category === budget.category && t.type === 'Výdaj')
                .reduce((sum, t) => sum + t.amount, 0);
            const percentage = budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0;
            const remaining = budget.limit - spent;
            return {
                ...budget,
                spent,
                percentage,
                remaining,
                status: spent > budget.limit ? 'Překročeno' : 'OK'
            };
        });
    }, [budgets, filteredTransactions]);

    const expenseByCategory = useMemo(() => {
        const expenseMap = new Map<string, number>();
        filteredTransactions
            .filter(t => t.type === 'Výdaj')
            .forEach(t => {
                expenseMap.set(t.category, (expenseMap.get(t.category) || 0) + t.amount);
            });
        return Array.from(expenseMap.entries()).map(([name, value]) => ({ name, value }));
    }, [filteredTransactions]);

    const cashflowTrendData: MonthlySummary[] = useMemo(() => {
        const monthlyData: { [key: string]: { income: number, expenses: number } } = {};
        transactions.forEach(t => {
            const date = new Date(t.date);
            const year = date.getFullYear();
            if (year !== selectedYear) return;
            const month = date.toLocaleString('cs-CZ', { month: 'short' });
            const key = `${date.getMonth()}`;

            if (!monthlyData[key]) {
                monthlyData[key] = { income: 0, expenses: 0 };
            }
            if (t.type === 'Příjem') {
                monthlyData[key].income += t.amount;
            } else {
                monthlyData[key].expenses += t.amount;
            }
        });
        
        const monthNames = Array.from({length: 12}, (_, i) => new Date(0, i).toLocaleString('cs-CZ', {month: 'short'}));

        return monthNames.map((monthName, index) => {
            const data = monthlyData[index] || { income: 0, expenses: 0 };
            return {
                month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                income: data.income,
                expenses: data.expenses,
                balance: data.income - data.expenses,
            };
        });
    }, [transactions, selectedYear]);

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
            return newDate;
        });
        setSelectedCategory(null);
    };

     const handleYearChange = (year: number) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setFullYear(year);
            return newDate;
        });
        setSelectedCategory(null);
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(prev => prev === category ? null : category);
    };
    
    const transactionsForSelectedCategory = useMemo(() => {
       if (!selectedCategory) return [];
       return filteredTransactions.filter(t => t.category === selectedCategory && t.type === 'Výdaj');
    }, [filteredTransactions, selectedCategory]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-center text-red-500 font-semibold p-8">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <Header
                currentDate={currentDate}
                onMonthChange={handleMonthChange}
                onYearChange={handleYearChange}
                allYears={[...new Set(transactions.map(t => new Date(t.date).getFullYear()))]}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Měsíční příjmy" value={monthlySummary.income} type="income" />
                <KpiCard title="Měsíční výdaje" value={monthlySummary.expenses} type="expense" />
                <KpiCard title="Měsíční bilance" value={monthlySummary.balance} type="balance" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Stav rozpočtu vs. realita</h3>
                    <BudgetStatusChart data={budgetStatus} onCategoryClick={handleCategorySelect} />
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Výdaje podle kategorií</h3>
                    <ExpenseByCategoryChart data={expenseByCategory} onCategoryClick={handleCategorySelect} />
                </div>
            </div>

            {selectedCategory && (
                <TransactionList 
                    category={selectedCategory} 
                    transactions={transactionsForSelectedCategory}
                    onClose={() => setSelectedCategory(null)}
                />
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Vývoj Cashflow ({selectedYear})</h3>
                <CashflowTrendChart data={cashflowTrendData} />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <AiAssistant budgetStatus={budgetStatus} monthlySummary={monthlySummary} transactions={filteredTransactions} />
            </div>
        </div>
    );
};

export default Dashboard;
