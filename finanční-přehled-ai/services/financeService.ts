
import { Transaction, CategoryBudget } from '../types';

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', date: '2024-06-01', amount: 50000, description: 'Výplata', category: 'Příjem', type: 'Příjem' },
    { id: '2', date: '2024-06-01', amount: 12000, description: 'Nájem', category: 'Bydlení', type: 'Výdaj' },
    { id: '3', date: '2024-06-03', amount: 1500, description: 'Nákup potravin - Albert', category: 'Jídlo', type: 'Výdaj' },
    { id: '4', date: '2024-06-05', amount: 800, description: 'Večeře s přáteli', category: 'Zábava', type: 'Výdaj' },
    { id: '5', date: '2024-06-10', amount: 750, description: 'Měsíční jízdenka', category: 'Doprava', type: 'Výdaj' },
    { id: '6', date: '2024-06-12', amount: 3200, description: 'Nákup oblečení', category: 'Oblečení', type: 'Výdaj' },
    { id: '7', date: '2024-06-15', amount: 2500, description: 'Účet za elektřinu', category: 'Bydlení', type: 'Výdaj' },
    { id: '8', date: '2024-06-20', amount: 450, description: 'Kino', category: 'Zábava', type: 'Výdaj' },
    { id: '9', date: '2024-06-25', amount: 1800, description: 'Nákup potravin - Lidl', category: 'Jídlo', type: 'Výdaj' },
    
    { id: '10', date: '2024-07-01', amount: 51000, description: 'Výplata', category: 'Příjem', type: 'Příjem' },
    { id: '11', date: '2024-07-01', amount: 12000, description: 'Nájem', category: 'Bydlení', type: 'Výdaj' },
    { id: '12', date: '2024-07-04', amount: 1700, description: 'Nákup potravin', category: 'Jídlo', type: 'Výdaj' },
    { id: '13', date: '2024-07-06', amount: 1200, description: 'Koncert', category: 'Zábava', type: 'Výdaj' },
    { id: '14', date: '2024-07-09', amount: 750, description: 'Měsíční jízdenka', category: 'Doprava', type: 'Výdaj' },
    { id: '15', date: '2024-07-16', amount: 2600, description: 'Účet za plyn', category: 'Bydlení', type: 'Výdaj' },
    { id: '16', date: '2024-07-22', amount: 2200, description: 'Nákup potravin', category: 'Jídlo', type: 'Výdaj' },
    { id: '17', date: '2024-07-28', amount: 950, description: 'Restaurace', category: 'Jídlo', type: 'Výdaj' },
    { id: '18', date: '2024-07-29', amount: 3500, description: 'Faktura za projekt', category: 'Příjem', type: 'Příjem' },

    { id: '19', date: '2024-08-01', amount: 51000, description: 'Výplata', category: 'Příjem', type: 'Příjem' },
    { id: '20', date: '2024-08-01', amount: 12000, description: 'Nájem', category: 'Bydlení', type: 'Výdaj' },
    { id: '21', date: '2024-08-05', amount: 2000, description: 'Nákup potravin', category: 'Jídlo', type: 'Výdaj' },
    { id: '22', date: '2024-08-10', amount: 800, description: 'Posilovna', category: 'Zdraví', type: 'Výdaj' },
    { id: '23', date: '2024-08-11', amount: 750, description: 'Měsíční jízdenka', category: 'Doprava', type: 'Výdaj' },
    { id: '24', date: '2024-08-18', amount: 3000, description: 'Výlet', category: 'Zábava', type: 'Výdaj' },
    { id: '25', date: '2024-08-25', amount: 2500, description: 'Účet za internet', category: 'Bydlení', type: 'Výdaj' },
    { id: '26', date: '2024-08-30', amount: 4200, description: 'Oprava auta', category: 'Doprava', type: 'Výdaj' },
];

const MOCK_BUDGETS: CategoryBudget[] = [
  { category: 'Bydlení', limit: 18000 },
  { category: 'Jídlo', limit: 8000 },
  { category: 'Doprava', limit: 3000 },
  { category: 'Zábava', limit: 4000 },
  { category: 'Oblečení', limit: 2500 },
  { category: 'Zdraví', limit: 1500 },
];

export const getTransactions = async (): Promise<Transaction[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_TRANSACTIONS;
};

export const getBudgets = async (): Promise<CategoryBudget[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_BUDGETS;
};
