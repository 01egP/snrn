export interface Transaction {
  id: number;
  amount: number;
  date: Date;
  categoryId: number;
  type: 'income' | 'expense';
  description: string;
}
