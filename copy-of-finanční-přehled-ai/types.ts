
export type TransactionType = 'Příjem' | 'Výdaj';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
}

export interface CategoryBudget {
  category: string;
  limit: number;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface BudgetStatus extends CategoryBudget {
  spent: number;
  percentage: number;
  remaining: number;
  status: 'OK' | 'Překročeno';
}
