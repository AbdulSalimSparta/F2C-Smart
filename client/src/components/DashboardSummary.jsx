import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardCard from './DashboardCard';
import '../styles/DashboardSummary.css';

const sampleData = [
  { name: 'Mon', value: 10 },
  { name: 'Tue', value: 12 },
  { name: 'Wed', value: 8 },
  { name: 'Thu', value: 14 },
  { name: 'Fri', value: 11 },
];

const DashboardSummary = () => {
  const [metrics, setMetrics] = useState({});
  const [salesHistory, setSalesHistory] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    try {
      const [metricRes, salesRes, pendingRes] = await Promise.all([
        axios.get('http://localhost:5000/api/farmer/metrics', headers),
        axios.get('http://localhost:5000/api/farmer/sales-history', headers),
        axios.get('http://localhost:5000/api/farmer/pending-approvals', headers),
      ]);

      setMetrics(metricRes.data);
      setSalesHistory(salesRes.data);
      setPendingProducts(pendingRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
      <div className="dashboard-grid">
        <div className="dashboard-grid">
        <DashboardCard
          title="Revenue"
          value={metrics.revenue || 0}
          change={4.7}
          color="#82ca9d"
          data={sampleData}
        />
        <DashboardCard
          title="Total Products"
          value={metrics.total_products || 0}
          change={12.4}
          color="#8dd1e1"
          data={sampleData}
        />
        <DashboardCard
          title="Pending Approvals"
          value={metrics.pending_approvals || 0}
          change={-3.8}
          color="#ffc658"
          data={sampleData}
        />
        <DashboardCard
          title="Total Orders"
          value={metrics.total_orders || 0}
          change={-2.71}
          color="#f77474"
          data={sampleData}
        />
      </div>
      </div>
  );
};

export default DashboardSummary;
