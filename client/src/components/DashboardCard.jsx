import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import '../styles/DashboardCard.css';

const DashboardCard = ({ title, value, change, data, color }) => {
  const isPositive = change >= 0;

  return (
    <div className="dashboard-card">
      <h4>{title}</h4>
      <div className="dashboard-value">{value.toLocaleString()}</div>
      <div className={`dashboard-change ${isPositive ? 'up' : 'down'}`}>
        {isPositive ? <ArrowUpward /> : <ArrowDownward />}
        {Math.abs(change)}%
      </div>
      <ResponsiveContainer width="100%" height={50}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardCard;
