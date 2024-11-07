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

  // Example transactions data with location
  const transactions = [
    { latitude: 40.7128, longitude: -74.006, amount: 220.5 }, // New York
    { latitude: 40.7306, longitude: -73.9352, amount: 180.0 }, // Brooklyn
    { latitude: 40.6501, longitude: -73.9496, amount: 150.0 }, // Flatbush
    { latitude: 40.6782, longitude: -73.9442, amount: 140.0 }, // Bedford-Stuyvesant
    { latitude: 40.7831, longitude: -73.9712, amount: 160.0 }, // Upper West Side, Manhattan
    { latitude: 40.758, longitude: -73.9855, amount: 170.0 }, // Midtown Manhattan
    { latitude: 40.7282, longitude: -74.0776, amount: 100.0 }, // Jersey City, NJ (рядом с NY)

    { latitude: 38.9072, longitude: -77.0369, amount: 110.3 }, // Washington
    { latitude: 41.8781, longitude: -87.6298, amount: 10.0 }, // Chicago
    { latitude: 29.7604, longitude: -95.3698, amount: 70.1 }, // Houston
    { latitude: 25.7617, longitude: -80.1918, amount: 150.0 }, // Miami
  ];

  const maxAmount = Math.max(...transactions.map((tx) => tx.amount));

  // Convert transaction data to heatmap format
  const heatmap_Data: [number, number, number][] = transactions.map((tx) => [
    tx.latitude,
    tx.longitude,
    tx.amount / maxAmount, // Intensity (e.g. amount of expenses, normalized)
  ]);

  // Component for creating a heat map
  const HeatmapLayer = () => {
    const map = useMap();

    useEffect(() => {
      let currentHeatLayer: L.Layer | null = null;

      const updateHeatmap = () => {
        const zoomLevel = map.getZoom();
        const heatLayerOptions = {
          radius: zoomLevel < 6 ? 15 : 30,
          blur: zoomLevel < 6 ? 5 : 15,
          max: 1.0,
          minOpacity: 0.7,
          gradient: {
            0.3: 'yellow',
            0.6: 'orange',
            1.0: 'red',
          },
        };

        // Remove the current heatmap layer if it exists
        if (currentHeatLayer) {
          map.removeLayer(currentHeatLayer);
        }

        // Create a new heatmap layer with the updated options
        currentHeatLayer = L.heatLayer(heatmap_Data, heatLayerOptions);
        currentHeatLayer.addTo(map);
      };

      // Listen for zoom event and update heatmap
      map.on('zoomend', updateHeatmap);

      // Initially draw heatmap
      updateHeatmap();

      return () => {
        map.off('zoomend', updateHeatmap);
        // Remove heatmap layer when component unmounts
        if (currentHeatLayer) {
          map.removeLayer(currentHeatLayer);
        }
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
