import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FarmerHeader from './FarmerHeader';
// import './SalesHistory.css';

const SalesHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/farmer/sales-history', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setHistory(res.data));
  }, []);

  return (<>
  <FarmerHeader />
  <div className='container'>
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
                  {history.map(sale => (
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
        </div>
  </>
  );
};

export default SalesHistory;
