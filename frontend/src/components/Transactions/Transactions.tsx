import React, { useState, useEffect } from 'react';
import './Transactions.css';
import { TransactionService } from '../../services/transaction.service';

interface Transaction {
  id: number;
  amount: number;
  date: Date;
  categoryId: number;
  type: string;
  description: string;
}

const Transactions: React.FC = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  // Calculate totals based on transaction data
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
          <option>Transportation</option>
          <option>Entertainment</option>
        </select>
        <select>
          <option>All types </option>
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
              className={`transaction-amount ${transaction.type === 'expense' ? 'expense' : 'income'}`}
            >
              {transaction.type === 'expense' ? '-' : '+'} $
              {Number(transaction.amount).toFixed(2)}
            </span>

            <button className="edit-button">Edit</button>
            <button className="delete-button">Delete</button>
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
            <form>
              <label>Amount</label>
              <input type="number" placeholder="Enter amount" required />

              <label>Category</label>
              <select>
                <option>Food</option>
                <option>Transportation</option>
                <option>Entertainment</option>
              </select>

              <label>Type</label>
              <select>
                <option>Income</option>
                <option>Expense</option>
              </select>

              <label>Date</label>
              <input type="date" required />

              <label>Description</label>
              <input type="text" placeholder="Enter description" />

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
