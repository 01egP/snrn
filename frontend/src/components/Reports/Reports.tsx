import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';
import './Reports.css';

// Register Chart.js components
ChartJS.register(
  ArcElement, // For Pie chart
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
);

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
          TransactionService.getTransactions(),
          CategoryService.getCategories(),
        ]);

        const processedTransactions = transactionData.map((tx) => ({
          ...tx,
          date: new Date(tx.date), // Convert date to Date object
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

  // Creating a report "Expenses by category"
  const categoryExpenses = categories.reduce(
    (acc: { [key: string]: number }, category) => {
      const total = transactions
        .filter((tx) => tx.categoryId === category.id && tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);
      acc[category.name] = total;
      return acc;
    },
    {},
  );

  const pieData = {
    labels: Object.keys(categoryExpenses),
    datasets: [
      {
        data: Object.values(categoryExpenses),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4CAF50',
          ' #FF5733',
        ],
      },
    ],
  };

  // Creating the report "Income and Expense for the period"
  const periodLabels = [
    ...new Set(transactions.map((tx) => tx.date.toISOString().slice(0, 7))),
  ].sort();
  const incomeData = periodLabels.map((date) => {
    return transactions
      .filter(
        (tx) =>
          tx.date.toISOString().slice(0, 7) === date && tx.type === 'income',
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
  });

  const expenseData = periodLabels.map((date) => {
    return transactions
      .filter(
        (tx) =>
          tx.date.toISOString().slice(0, 7) === date && tx.type === 'expense',
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
  });

  const lineData = {
    labels: periodLabels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        fill: false,
        borderColor: '#4CAF50',
      },
      {
        label: 'Expense',
        data: expenseData,
        fill: false,
        borderColor: '#FF5733',
      },
    ],
  };

  // Creating the report "Expense frequency by range"
  const expenseFrequencies = {
    '0-50': 0,
    '50-100': 0,
    '100-200': 0,
    '200-300': 0,
    '300+': 0,
  };

  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      if (tx.amount < 50) expenseFrequencies['0-50']++;
      else if (tx.amount < 100) expenseFrequencies['50-100']++;
      else if (tx.amount < 200) expenseFrequencies['100-200']++;
      else if (tx.amount < 300) expenseFrequencies['200-300']++;
      else expenseFrequencies['300+']++;
    });

  const barData = {
    labels: Object.keys(expenseFrequencies),
    datasets: [
      {
        label: 'Expense frequency',
        data: Object.values(expenseFrequencies),
        backgroundColor: '#36A2EB',
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
          <option value="year ">This year</option>
        </select>
      </div>
      <div className="report-section">
        <h2>Expenses by category</h2>
        <div className="report-section-circle">
          <Pie data={pieData} />
        </div>
      </div>
      <div className="report-section">
        <h2>Income and expenses for period</h2>
        <Line data={lineData} />
      </div>
      <div className="report-section">
        <h2>Expense frequency</h2>
        <Bar data={barData} />
      </div>{' '}
    </div>
  );
};

export default Reports;
