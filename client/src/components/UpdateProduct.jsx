import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/UpdateProducts.css';
import ConfirmModal from './ConfirmModal';
import FarmerHeader from './FarmerHeader';

const UpdateProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/farmer/my-products', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setProducts(res.data));
  }, []);

  const handleInputChange = (id, field, value) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const confirmUpdate = (product) => {
    setSelectedProduct(product);
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;

    try {
      await axios.put(`http://localhost:5000/api/farmer/update-product/${selectedProduct.id}`, selectedProduct, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Product updated and submitted for re-approval');
    } catch (error) {
      alert('Update failed');
    } finally {
      setSelectedProduct(null);
    }
  };

  return (
    <>
    <FarmerHeader />
    <div className="update-products">
      <h3>Update Your Products</h3>
      <div className="table-wrapper">
        <table className="product-table large-cells">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Description</th>
              <th>Image URL</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td><img src={product.image_url} alt={product.name} className="product-thumbnail large-thumbnail" /></td>
                <td><input value={product.name} onChange={(e) => handleInputChange(product.id, 'name', e.target.value)} /></td>
                <td><input type="number" value={product.price} onChange={(e) => handleInputChange(product.id, 'price', e.target.value)} /></td>
                <td><input type="number" value={product.stock} onChange={(e) => handleInputChange(product.id, 'stock', e.target.value)} /></td>
                <td><textarea value={product.description} onChange={(e) => handleInputChange(product.id, 'description', e.target.value)} className="expandable-textarea" /></td>
                <td><input value={product.image_url} onChange={(e) => handleInputChange(product.id, 'image_url', e.target.value)} /></td>
                <td><button onClick={() => confirmUpdate(product)}>Update</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.map(product => (
      <div key={product.id} className="product-card-mobile">
        <img src={product.image_url} alt={product.name} />
        <div>
          <label>Name</label>
          <input value={product.name} onChange={(e) => handleInputChange(product.id, 'name', e.target.value)} />
        </div>
        <div>
          <label>Price</label>
          <input type="number" value={product.price} onChange={(e) => handleInputChange(product.id, 'price', e.target.value)} />
        </div>
        <div>
          <label>Stock</label>
          <input type="number" value={product.stock} onChange={(e) => handleInputChange(product.id, 'stock', e.target.value)} />
        </div>
        <div>
          <label>Description</label>
          <textarea value={product.description} onChange={(e) => handleInputChange(product.id, 'description', e.target.value)} className="expandable-textarea" />
        </div>
        <div>
          <label>Image URL</label>
          <input value={product.image_url} onChange={(e) => handleInputChange(product.id, 'image_url', e.target.value)} />
        </div>
        <button onClick={() => confirmUpdate(product)}>Update</button>
      </div>
    ))}


      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onConfirm={handleUpdate}
        message={`Are you sure you want to update "${selectedProduct?.name}"?`}
      />
    </div>
  </>
  );
};

export default UpdateProducts;

