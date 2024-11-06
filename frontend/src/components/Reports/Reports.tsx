import React, { useState } from 'react';
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

const Reports: React.FC = () => {
  const [period, setPeriod] = useState('month'); // By default, the report is for a month

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(e.target.value);
  };

  // Data for graphs
  const pieData = {
    labels: ['Food', 'Transportation', 'Entertainment', 'Rent', 'Health'],
    datasets: [
      {
        data: [300, 150, 200, 500, 100],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4CAF50',
          '#FF5733',
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'center' as const,
      },
    },
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Income',
        data: [500, 700, 800, 600, 750],
        fill: false,
        borderColor: '#4CAF50',
      },
      {
        label: 'Expense',
        data: [400, 500, 600, 700, 650],
        fill: false,
        borderColor: '#FF5733',
      },
    ],
  };

  const barData = {
    labels: ['$0-50', '$50-100', '$100-200', '$200-300', '$300+'],
    datasets: [
      {
        label: 'Frequency of Expenses',
        data: [12, 19, 8, 5, 2],
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
          <option value="month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="report-section">
        <h2>Expenses by Category</h2>
        <div className="report-section-circle">
          <Pie data={pieData} options={options} />
        </div>
      </div>

      <div className="report-section">
        <h2>Income and Expense Over Time</h2>
        <Line data={lineData} />
      </div>

      <div className="report-section">
        <h2>Expense Frequency</h2>
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default Reports;
