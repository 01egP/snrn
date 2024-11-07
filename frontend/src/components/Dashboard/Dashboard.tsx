import * as L from 'leaflet';
import 'leaflet.heat';
import React, { useEffect } from 'react';
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
import './Dashboard.css';

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
  // Data for KPI
  const totalIncome = 3000;
  const totalExpense = 2000;
  const balance = totalIncome - totalExpense;
  const savings = 500;

  // Map center (e.g., New York)
  const center: [number, number] = [40.7128, -74.006];

  // Heatmap data (coordinates with intensity)
  const heatmap_Data: [number, number, number][] = [
    [40.7128, -74.006, 0.5], // New York
    [34.0522, -118.2437, 0.8], // Los Angeles
    [41.8781, -87.6298, 0.7], // Chicago
    [29.7604, -95.3698, 0.6], // Houston
    [25.7617, -80.1918, 0.9], // Miami
  ];

  // Component for creating a heat map
  const HeatmapLayer = () => {
    const map = useMap();

    useEffect(() => {
      const heatLayer = L.heatLayer(heatmap_Data, {
        radius: 30,
        blur: 25,
        max: 1.0,
        minOpacity: 0.5,
      });

      heatLayer.addTo(map);

      return () => {
        heatLayer.remove();
      };
    }, [map]);

    return null;
  };

  // Data for charts
  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Income',
        data: [800, 1200, 1000, 1500, 1300],
        borderColor: '#4CAF50',
        fill: false,
      },
      {
        label: 'Expense',
        data: [500, 700, 600, 1000, 900],
        borderColor: '#FF5733',
        fill: false,
      },
    ],
  };

  const pieData = {
    labels: ['Food', 'Transportation', 'Entertainment', 'Rent', 'Health'],
    datasets: [
      {
        data: [400, 150, 200, 600, 150],
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
            attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
          />
          <HeatmapLayer />
        </MapContainer>
      </div>

      {/* Action buttons */}
      <div className="actions-container">
        <button className="action-button">Add Transaction</button>
        <button className="action-button">View Transactions</button>
        <button className="action-button">View Reports</button>
      </div>
    </div>
  );
};

export default Dashboard;
