export type Tab = 'dashboard' | 'wallet' | 'analytics' | 'security';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  status: 'safe' | 'suspicious' | 'blocked';
}

export interface SpendingData {
  name: string;
  amount: number;
}

export interface Category {
  name: string;
  amount: number;
  icon: string;
  color: string;
  percentage: number;
}
