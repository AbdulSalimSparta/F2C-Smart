// PendingApprovals.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './PendingApprovals.css';

const PendingApprovals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/farmer/pending-approvals', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching pending approvals:', err);
      }
    };
    fetchPending();
  }, []);

  return (
    <div className="pending-approvals-container">
      <h2>Pending Product Approvals</h2>
      {products.length === 0 ? (
        <p>No products pending approval.</p>
      ) : (
        <div className="pending-products">
          {products.map((product) => (
            <div key={product.id} className="pending-card">
              <img src={product.image_url} alt={product.name} height={200} width={200}/>
              <div>
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <p><strong>Price:</strong> ₹{product.price}</p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <p><em>Uploaded on {new Date(product.created_at).toLocaleDateString()}</em></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
