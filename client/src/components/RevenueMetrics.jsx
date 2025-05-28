import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './RevenueMetrics.css';

const RevenueMetrics = () => {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/farmer/metrics', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setMetrics(res.data));
  }, []);

  return (
    <div className="revenue-metrics">
      <h3>Revenue Dashboard</h3>
      <div className="metrics">
        <p>Total Products: {metrics.total_products}</p>
        <p>Total Revenue: ₹{metrics.revenue}</p>
        <p>Pending Products: {metrics.pending_approval}</p>
        <p>Total Orders: {metrics.total_orders}</p>
      </div>
    </div>
  );
};

export default RevenueMetrics;
