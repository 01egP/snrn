import React, { useState, useEffect, FormEvent } from 'react';
import './Transactions.css';
import { TransactionService } from '../../services/transaction.service';
interface Transaction {
  id: number;
  amount: number;
  date: Date;
  categoryId: number;
  type: string;
  description: string;
  latitude?: number;
  longitude?: number;
}

interface NewTransaction {
  amount: number;
  date: string; // Use the input string via <input type="date">
  categoryId: number;
  type: string;
  description: string;
  latitude?: number;
  longitude?: number;
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

const Transactions: React.FC = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    amount: 0,
    date: '',
    categoryId: 1,
    type: 'income',
    description: '',
    latitude: undefined,
    longitude: undefined,
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await TransactionService.getTransactionsByUserId();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]:
        name === 'amount' ||
        name === 'categoryId' ||
        name === 'latitude' ||
        name === 'longitude'
          ? Number(value)
          : value,
    }));
  };

  const handleSaveTransaction = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem('userID');
      if (!userId) {
        throw new Error('User ID is missing');
      }

      const transactionToSave = {
        ...newTransaction,
        date: new Date(newTransaction.date), // Convert string to Date
        type: newTransaction.type as TransactionType, // Cast to TransactionType
        latitude: newTransaction.latitude ?? 40.7128,
        longitude: newTransaction.longitude ?? -74.006,
        userId: Number(userId),
      };

      const createdTransaction =
        await TransactionService.createTransaction(transactionToSave);
      setTransactions((prev) => [...prev, createdTransaction]);
      closeAddModal();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  const totalIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="transactions-container">
      <h1>Transactions</h1>

      {/* Filters */}
      <div className="filters">
        <input type="text" placeholder="Search..." />
        <select>
          <option>All categories</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Entertainment</option>
          <option>Housing</option>
          <option>Health</option>
          <option>Savings</option>
          <option>Other</option>
        </select>
        <select>
          <option>All types</option>
          <option>Income</option>
          <option>Expense</option>
        </select>
        <input type="date" placeholder="Start date" />
        <input type="date" placeholder="Date endings" />
      </div>

      {/* List of transactions */}
      <div className="transaction-list">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-item">
            <span className="transaction-date">
              {new Date(transaction.date).toLocaleDateString()}
            </span>
            <span className="transaction-category">
              Category {transaction.categoryId}
            </span>
            <span className="transaction-description">
              {transaction.description}
            </span>
            <span
              className={`transaction-amount ${
                transaction.type === 'expense' ? 'expense' : 'income'
              }`}
            >
              {transaction.type === 'expense' ? '-' : '+'} $
              {Number(transaction.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="transaction-summary">
        <span>
          Total income: <strong>${totalIncome.toFixed(2)}</strong>
        </span>
        <span>
          Total expenses: <strong>${totalExpenses.toFixed(2)}</strong>
        </span>
        <span>
          Balance: <strong>${balance.toFixed(2)}</strong>
        </span>
      </div>

      <button onClick={openAddModal} className="add-transaction-button">
        + Add transaction
      </button>

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add transaction</h2>
            <form onSubmit={handleSaveTransaction}>
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={newTransaction.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                required
              />

              <label>Category</label>
              <select
                name="categoryId"
                value={newTransaction.categoryId}
                onChange={handleInputChange}
              >
                <option value={1}>Food</option>
                <option value={2}>Transport</option>
                <option value={3}>Entertainment</option>
                <option value={4}>Housing</option>
                <option value={5}>Health</option>
                <option value={6}>Savings</option>
                <option value={7}>Other</option>
              </select>

              <label>Type</label>
              <select
                name="type"
                value={newTransaction.type}
                onChange={handleInputChange}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <label>Date</label>
              <input
                type="date"
                name="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                required
              />

              <label>Description</label>
              <input
                type="text"
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
                placeholder="Enter description"
              />

              <label>Latitude</label>
              <input
                type="number"
                name="latitude"
                value={newTransaction.latitude || ''}
                onChange={handleInputChange}
                placeholder="Enter latitude (default: 40.7128)"
              />

              <label>Longitude</label>
              <input
                type="number"
                name="longitude"
                value={newTransaction.longitude || ''}
                onChange={handleInputChange}
                placeholder="Enter longitude (default: -74.006)"
              />

              <button type="submit">Save</button>
              <button type="button" onClick={closeAddModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
