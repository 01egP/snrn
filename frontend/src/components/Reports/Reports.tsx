import React, { useState, useEffect } from 'react';
import { Bar, Scatter, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from 'chart.js';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';
import './Reports.css';

interface Transaction {
  amount: number;
  date: Date;
  categoryId: number;
  type: string;
}

interface Category {
  id: number;
  name: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
);

const Reports: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [transactionData, categoryData] = await Promise.all([
          TransactionService.getTransactionsByUserId(),
          CategoryService.getCategories(),
        ]);

        // Process transactions and convert date to Date object
        const processedTransactions = transactionData.map((tx) => ({
          ...tx,
          date: new Date(tx.date), // Ensure date is a Date object
          amount: parseFloat(String(tx.amount)), // Ensure amount is a number
        }));

        setTransactions(processedTransactions);
        setCategories(categoryData);
      } catch (err) {
        setError('Error loading data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(e.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!transactions.length || !categories.length) return <p>No data</p>;

  // Data for Stacked Bar Chart: Income and expenses by month
  const periodLabels = [
    ...new Set(transactions.map((tx) => tx.date.toISOString().slice(0, 7))),
  ].sort();
  const incomeData = periodLabels.map((date) =>
    transactions
      .filter(
        (tx) =>
          tx.date.toISOString().slice(0, 7) === date && tx.type === 'income',
      )
      .reduce((sum, tx) => sum + tx.amount, 0),
  );
  const expenseData = periodLabels.map((date) =>
    transactions
      .filter(
        (tx) =>
          tx.date.toISOString().slice(0, 7) === date && tx.type === 'expense',
      )
      .reduce((sum, tx) => sum + tx.amount, 0),
  );

  const stackedBarData = {
    labels: periodLabels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: '#4CAF50',
      },
      {
        label: 'Expense',
        data: expenseData,
        backgroundColor: '#FF5733',
      },
    ],
  };

  // Data for Scatter Plot: Correlation between the amount of expenses and their frequency
  const scatterData = {
    datasets: [
      {
        label: 'Expense Scatter',
        data: transactions
          .filter((tx) => tx.type === 'expense')
          .map((tx) => ({
            x: tx.amount,
            y: Math.random() * 10, // Use a random value for frequency
          })),
        backgroundColor: '#36A2EB',
      },
    ],
  }; // Radar Chart data: general statistics by category
  const radarData = {
    labels: categories.map((cat) => cat.name),
    datasets: [
      {
        label: 'Expenses by Category',
        data: categories.map((cat) =>
          transactions
            .filter((tx) => tx.categoryId === cat.id && tx.type === 'expense')
            .reduce((sum, tx) => sum + tx.amount, 0),
        ),
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="reports-container">
      <h1>Reports</h1>
      <div className="filters-reports">
        <label>Period:</label>
        <select value={period} onChange={handlePeriodChange}>
          <option value="month">This month</option>
          <option value="last_month">Last month</option>
          <option value="quarter">This quarter</option>
          <option value="year">This year</option>
        </select>
      </div>

      {/* Stacked Bar Chart: Income and Expenses by Month */}
      <div className="report-section">
        <h2>Income and Expenses by Month</h2>
        <Bar
          data={stackedBarData}
          options={{
            plugins: {
              legend: { position: 'top' },
            },
            responsive: true,
            scales: {
              x: { stacked: true },
              y: { stacked: true },
            },
          }}
        />
      </div>

      {/* Scatter Plot: Expense correlation */}
      <div className="report-section">
        <h2>Expense Correlation</h2>
        <Scatter
          data={scatterData}
          options={{
            scales: {
              x: { title: { display: true, text: 'Amount' } },
              y: { title: { display: true, text: 'Frequency' } },
            },
          }}
        />
      </div>

      {/* Radar Chart: Expenses by Category */}
      <div className="report-section">
        <h2>Expenses by Category</h2>
        <Radar data={radarData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default Reports;
