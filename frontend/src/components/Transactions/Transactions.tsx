import React, { useState } from 'react';
import './Transactions.css';

const Transactions: React.FC = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  return (
    <div className="transactions-container">
      <h1>Transactions</h1>

      {/* Filters */}
      <div className="filters">
        <input type="text" placeholder="Search..." />
        <select>
          <option>All Categories</option>
          <option>Food</option>
          <option>Transportation</option>
          <option>Entertainment</option>
        </select>
        <select>
          <option>All Types</option>
          <option>Income</option>
          <option>Expense</option>
        </select>
        <input type="date" placeholder="Start Date" />
        <input type="date" placeholder="End Date" />
      </div>

      {/* List of transactions */}
      <div className="transaction-list">
        <div className="transaction-item">
          <span className="transaction-date">2024-11-01</span>
          <span className="transaction-category">Food</span>
          <span className="transaction-description">Dinner at restaurant</span>
          <span className="transaction-amount expense">- $50.00</span>
          <button className="edit-button">Edit</button>
          <button className="delete-button">Delete</button>
        </div>
      </div>

      {/* Statistic */}
      <div className="transaction-summary">
        <span>
          Total Income: <strong>$3000.00</strong>
        </span>
        <span>
          Total Expense: <strong>$1500.00</strong>
        </span>
        <span>
          Net Balance: <strong>$1500.00</strong>
        </span>
      </div>

      <button onClick={openAddModal} className="add-transaction-button">
        + Add Transaction
      </button>

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Transaction</h2>
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
