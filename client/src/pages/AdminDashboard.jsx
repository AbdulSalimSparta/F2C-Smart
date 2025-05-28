import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  AreaChart,
  Area,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Button } from "@mui/material";
import "../styles/AdminDashboard.css";
import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";

const sampleData = [
  { name: "Mon", value: 10 },
  { name: "Tue", value: 12 },
  { name: "Wed", value: 8 },
  { name: "Thu", value: 14 },
  { name: "Fri", value: 11 },
];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [showPending, setShowPending] = useState(false);
  const COLORS = ["#0088FE", "#00C49F"]; // Users, Sellers

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/metrics")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  const userSellerData = useMemo(() => {
    if (!data) return [];
    return [
      { name: "Users", value: Number(data.totalUsers) },
      { name: "Sellers", value: Number(data.totalSellers) },
    ];
  }, [data]);

  const fetchPendingProducts = () => {
    axios
      .get("http://localhost:5000/admin/pending-products")
      .then((res) => setPendingProducts(res.data))
      .catch((err) => console.error(err));
  };

  const handleApprove = (id) => {
    axios
      .put(`http://localhost:5000/admin/approve-product/${id}`)
      .then(() => {
        setPendingProducts((prev) => prev.filter((p) => p.id !== id));
      })
      .catch((err) => console.error(err));
  };

  if (!data) return <p>Loading...</p>;
  console.log(data.dailyRevenue);
  const processedTopProducts = data.topProducts.map((item) => ({
    name: item.name,
    total_orders: item.order_count || 0,
  }));

  return (
    <>
      <Header />
      <div className="container">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-grid">
          <div className="dashboard-grid">
            <DashboardCard
              title="Revenue"
              value={data.totalRevenue || 0}
              change={4.7}
              color="#82ca9d"
              data={sampleData}
            />
            <DashboardCard
              title="Users"
              value={data.totalUsers || 0}
              change={12.4}
              color="#8dd1e1"
              data={sampleData}
            />
            <DashboardCard
              title="Sellers"
              value={data.totalSellers || 0}
              change={3.8}
              color="#ffc658"
              data={sampleData}
            />
            <DashboardCard
              title="Total Products"
              value={data.totalProducts || 0}
              change={2.71}
              color="#f77474"
              data={sampleData}
            />
            <DashboardCard
              title="Pending orders"
              value={data.pendingOrders || 0}
              change={2.71}
              color="#f94474"
              data={sampleData}
            />
          </div>
        </div>
         <h3 className="text-lg font-semibold mt-4">Daily Revenue Overview</h3>

          {data.dailyRevenue.length > 0 ? (
            <div style={{ width: "100%", height: 400, padding: "20px 0" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.dailyRevenue.map((item) => ({
                    date: item.date,
                    revenue: Number(item.revenue),
                  }))}
                  margin={{ top: 5, right: 30, left: 0, bottom: 10 }}
                >
                  <defs>
                    <linearGradient
                      id="greenRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(value) => `₹${value}`}
                    domain={[0, (dataMax) => Math.ceil(dataMax * 1.2)]} // <-- Dynamic padding
                  />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Area
                    type="linear"
                    dataKey="revenue"
                    stroke="#4CAF50"
                    fill="url(#greenRevenue)"
                    strokeWidth={2}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p>Loading revenue data...</p>
          )}


        <h2>Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data.monthlyRevenue.map((item) => ({
              month: item.month.substring(0, 7),
              revenue: item.revenue,
            }))}
          >
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            marginTop: "3rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1 }}>
            <h2>Users vs Sellers</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userSellerData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={true}
                >
                  {userSellerData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: 2 }}>
            <h2>Top Selling Products</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedTopProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_orders" fill="#82ca9d">
                  {processedTopProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#8884d8" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

         

        <div style={{ marginTop: "2rem" }}>
          <Button
            variant="contained"
            onClick={() => {
              fetchPendingProducts();
              setShowPending(!showPending);
            }}
          >
            {showPending ? "Hide" : "View"} Pending Approval Requests
          </Button>
        </div>

        {showPending && (
          <div style={{ marginTop: "2rem" }}>
            <h2>Pending Approval Requests</h2>
            {pendingProducts.length === 0 ? (
              <p>No pending requests.</p>
            ) : (
              <table className="pending-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Seller</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Approve</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.seller_name}</td>
                      <td>{product.category_name}</td>
                      <td>₹{product.price}</td>
                      <td>{product.stock}</td>
                      <td>
                        <Button
                          color="success"
                          variant="outlined"
                          onClick={() => handleApprove(product.id)}
                        >
                          Approve
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
