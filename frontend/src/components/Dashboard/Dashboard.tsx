import * as L from 'leaflet';
import 'leaflet.heat';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';
import './Dashboard.css';

interface Transaction {
  id: number;
  amount: number;
  date: Date;
  latitude?: number;
  longitude?: number;
  categoryId: number;
  type: string;
  description: string;
}

interface Category {
  id: number;
  name: string;
}

// Type extension for heatLayer
declare module 'leaflet' {
  export function heatLayer(
    latlngs: L.LatLngExpression[] | L.LatLngTuple[],
    options?: {
      radius?: number;
      blur?: number;
      max?: number;
      maxZoom?: number;
      gradient?: { [key: number]: string };
      minOpacity?: number;
    },
  ): L.Layer;
}

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard: React.FC = () => {
  // State for transaction
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load transaction and category data when component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionData, categoryData] = await Promise.all([
          TransactionService.getTransactions(),
          CategoryService.getCategories(),
        ]);
        // Process transactions and convert date
        const processedTransactions = transactionData.map((tx) => ({
          ...tx,
          date: new Date(tx.date),
          amount: parseFloat(String(tx.amount)),
        }));
        setTransactions(processedTransactions);
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching transactions or categories', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate KPIs based on transactions
  const totalIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const balance = totalIncome - totalExpense;
  const savings = totalIncome * 0.1; // For example, 10% of income

  // Coordinates for the map
  const center: [number, number] = [40.7128, -74.006];

  // Maximum amount for intensity normalization
  const maxAmount = Math.max(...transactions.map((tx) => tx.amount || 0), 1);

  // Heatmap data format
  const heatmap_Data: [number, number, number][] = transactions
    .filter((tx) => tx.latitude && tx.longitude)
    .map((tx) => [tx.latitude!, tx.longitude!, tx.amount / maxAmount]);

  const HeatmapLayer = () => {
    const map = useMap();

    useEffect(() => {
      const heatLayer = L.heatLayer(heatmap_Data, {
        radius: 25,
        blur: 15,
        max: 1.0,
        minOpacity: 0.6,
        gradient: {
          0.3: 'yellow',
          0.6: 'orange',
          1.0: 'red',
        },
      });

      heatLayer.addTo(map);
      return () => {
        heatLayer.remove();
      };
    }, [map, heatmap_Data]);

    return null;
  };

  // Data for line chart
  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Income',
        data: transactions
          .filter((tx) => tx.type === 'income')
          .map((tx) => tx.amount),
        borderColor: '#4CAF50',
        fill: false,
      },
      {
        label: 'Expense',
        data: transactions
          .filter((tx) => tx.type === 'expense')
          .map((tx) => tx.amount),
        borderColor: '#FF5733',
        fill: false,
      },
    ],
  };

  // Calculate category expenses for pie chart
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
          '#FF5733',
        ],
      },
    ],
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {/* KPI Summary */}
      <div className="kpi-container">
        <div className="kpi-item">
          <h2>Balance</h2>
          <p>${balance.toFixed(2)}</p>
        </div>
        <div className="kpi-item">
          <h2>Total Income</h2>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
        <div className="kpi-item">
          <h2>Total Expense</h2>
          <p>${totalExpense.toFixed(2)}</p>
        </div>
        <div className="kpi-item">
          <h2>Savings</h2>
          <p>${savings.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-container">
        <div className="chart-item">
          <h2>Income and Expense Over Time</h2>
          <Line data={lineData} />
        </div>
        <div className="chart-item">
          <h2>Expenses by Category</h2>
          <Pie data={pieData} />
        </div>
      </div>

      {/* Map with heat map */}
      <div className="map-container">
        <MapContainer
          center={center}
          zoom={5}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <HeatmapLayer />
        </MapContainer>
      </div>
    </div>
  );
};

export default Dashboard;
