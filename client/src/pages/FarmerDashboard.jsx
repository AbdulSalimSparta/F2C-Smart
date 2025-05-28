import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import _ from "lodash";

import "../styles/FarmerDashboard.css";
import DashboardSummary from "../components/DashboardSummary";

const CustomizedTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow-md border border-gray-200">
        <p className="text-sm text-gray-600">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs text-gray-700">
            {entry.name}: ₹{entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const FarmerDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [salesHistory, setSalesHistory] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    const [metricRes, salesRes, pendingRes] = await Promise.all([
      axios.get("http://localhost:5000/api/farmer/metrics", headers),
      axios.get("http://localhost:5000/api/farmer/sales-history", headers),
      axios.get("http://localhost:5000/api/farmer/pending-approvals", headers),
    ]);

    setMetrics(metricRes.data);
    setSalesHistory(salesRes.data);
    setPendingProducts(pendingRes.data);
  };

  const productNames = _.uniq(salesHistory.map((item) => item.product_name));
  const colors = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#22c55e",
  ];

  const filteredSales = salesHistory.filter((item) => {
    const itemDate = new Date(item.created_at);
    const matchesProduct =
      selectedProduct === "All" || item.product_name === selectedProduct;
    const matchesStart = !startDate || itemDate >= new Date(startDate);
    const matchesEnd = !endDate || itemDate <= new Date(endDate);
    return matchesProduct && matchesStart && matchesEnd;
  });

  const groupedByDate = _.groupBy(filteredSales, (item) =>
    new Date(item.created_at).toLocaleDateString()
  );

  const chartData = Object.entries(groupedByDate).map(([date, items]) => {
    const dataPoint = { created_at: date };
    items.forEach((item) => {
      const total = parseFloat(item.price) * item.quantity;
      dataPoint[item.product_name] =
        (dataPoint[item.product_name] || 0) + total;
    });
    return dataPoint;
  });

  return (
    <div className="dashboard-container">
      <DashboardSummary />

      <div className="chart-section">
        <div className="chart-header">
          <h3 className="chart-title">📈 Revenue Trends</h3>
          <div className="filters">
            <div className="filter-item">
              <label>Product:</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="All">All</option>
                {productNames.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label>From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="filter-item">
              <label>To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button
              className="clear-button"
              onClick={() => {
                setSelectedProduct("All");
                setStartDate("");
                setEndDate("");
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="created_at"
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
            <Tooltip content={<CustomizedTooltip />} />
            <Legend verticalAlign="top" height={36} />
            {selectedProduct === "All" ? (
              productNames.map((product, index) => (
                <Line
                  key={product}
                  type="monotone"
                  dataKey={product}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  name={product}
                />
              ))
            ) : (
              <Line
                type="monotone"
                dataKey={selectedProduct}
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7, strokeWidth: 2 }}
                name={selectedProduct}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h4 className="sales-table-heading">Sales Records</h4>
      <div className="sales-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Buyer</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {salesHistory.map((sale) => (
              <tr key={sale.order_id}>
                <td>{sale.order_id}</td>
                <td>{sale.product_name}</td>
                <td>{sale.buyer_name}</td>
                <td>{sale.quantity}</td>
                <td>₹{sale.price}</td>
                <td>₹{(parseFloat(sale.price) * sale.quantity).toFixed(2)}</td>
                <td>{new Date(sale.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pending-approvals">
        <h3>Pending Product Approvals</h3>
        {pendingProducts.length === 0 ? (
          <p>No pending products.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {pendingProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image_url} alt={product.name} />
                  </td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
