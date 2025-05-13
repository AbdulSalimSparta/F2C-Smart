import React, { useState } from 'react';
import axios from 'axios';

const FarmersProductForm = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm(prev => ({ ...prev, image: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);

    try {
      await axios.post('http://localhost:5000/farmers/products', formData);
      alert("Product submitted for approval!");
      setForm({ name: '', price: '', quantity: '', description: '', image: null });
    } catch (err) {
      console.error(err);
      alert("Error submitting product.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
      <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
      <input type="file" name="image" onChange={handleChange} required />
      <button type="submit">Submit for Approval</button>
    </form>
  );
};

export default FarmersProductForm;
