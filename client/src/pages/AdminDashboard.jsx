import React, { useEffect, useState ,useMemo} from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  const COLORS = ['#0088FE', '#00C49F']; // Users, Sellers

  useEffect(() => {
    axios.get('http://localhost:5000/admin/metrics')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
      
  }, []);

  const userSellerData = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'Users', value: Number(data.totalUsers)},
      { name: 'Sellers', value: Number(data.totalSellers)}
    ];
  }, [data]);

  if (!data) return <p>Loading...</p>;

  console.log("Total Users:", data.totalUsers);
  console.log(userSellerData);
  

  const processedTopProducts = data.topProducts.map(item => ({
    name: item.name,
    total_orders: item.order_count || 0, // fallback if null
  }));

  

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>
      
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <div className="cardadmin">Revenue: ₹{data.totalRevenue}</div>
        <div className="cardadmin">Users: {data.totalUsers}</div>
        <div className="cardadmin">Sellers: {data.totalSellers}</div>
        <div className="cardadmin">Products: {data.totalProducts}</div>
        <div className="cardadmin">Pending Orders: {data.pendingOrders}</div>
      </div>

      <h2>Monthly Revenue</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.monthlyRevenue.map(item => ({
          month: item.month.substring(0,7),
          revenue: item.revenue
        }))}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                {
                  processedTopProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#8884d8" />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
