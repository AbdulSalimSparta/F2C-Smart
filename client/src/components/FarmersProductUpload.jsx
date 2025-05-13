import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/FarmerProductUpload.css';
import { fetchCategories } from "../Data/data";
  import { jwtDecode } from "jwt-decode";
 
const FarmerProductUpload = () => {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
          const token = localStorage.getItem("token");
      
          if (token) {
              try {
                  const decoded = jwtDecode(token);
                  console.log("Decoded JWT:", decoded); // Debugging: Check full token
      
                  if (decoded?.userId) {
                      setUserId(decoded.userId);
                      console.log("Extracted User ID:", decoded.userId); // Debugging: Ensure correct ID
                  } else {
                      console.error("User ID missing in token!");
                  }
              } catch (error) {
                  console.error("Error decoding token:", error);
              }
          } else {
              console.error("No token found in localStorage.");
          }
      }, []);
      
      useEffect(() => {
          console.log("Updated userId state:", userId); // Logs when `userId` changes
      }, [userId]);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    stock: '',
    description: '',
    image_url: '',
    seller_id:userId,
  });

  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        console.log("Fetched Categories:", data);  // Debugging
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:5000/api/farmer/add-product", formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      alert('Product submitted for approval');
    } catch (err) {
      console.error(err);
      alert('Submission failed');
    }
  };

  return (
    <div className="upload-form">
      <h2>Upload a Product</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Product Name" onChange={handleChange} required />
        <select name="category_id" onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" onChange={handleChange} required />
        <input name="image_url" placeholder="Image URL" onChange={handleChange} />
        <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
        <button type="submit">Submit Product</button>
      </form>
    </div>
  );
};

export default FarmerProductUpload;
