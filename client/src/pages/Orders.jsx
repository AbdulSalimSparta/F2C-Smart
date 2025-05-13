import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/OrdersPage.css";
function OrdersPage(){
    const [userId, setUserId] = useState(null);
    const [orders, setOrders] = useState([]);

    
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





    const fetchOrders = async () => {
        const token = localStorage.getItem("token");
        if (!userId) {
            console.warn("User ID is not set, delaying API call...");
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5000/api/orders/${userId}`, 
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the request
                    }
                });
            console.log("Orders fetched:", response.data);


             if (response.data) {
                setOrders(response.data); // Ensure orders is an array
            } else {
                setOrders([]); // Fallback to empty array if no data
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Fetch orders only when `userId` is available
    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
    }, [userId]); // Runs when `userId` is updated
    

  return (
    <>
      <Header />
      <div className="orders-page container">
        <h2>Your Previous Orders</h2>
        {orders.length === 0 ? (
          <p>No previous orders found.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Order ID: {order.id}</h3>
                  <p className="order-price">Total Price: ₹{order.total_price}</p>
                </div>

                <div className="order-details">
                  <p className="payment-method">Payment Method: {order.payment_method}</p>
                  <p className="order-date">Placed On: {new Date(order.created_at).toLocaleString()}</p>
                </div>

                <h4>Items:</h4>
                <ul className="order-items">
                  {order.items.map((item) => (
                    <li key={item.product_id} className="order-item">
                      <span className="item-name">{item.name}</span> 
                      <span className="item-quantity">{item.quantity} x ₹{item.price}</span>
                      <span className="item-total">₹{item.quantity * item.price}</span>
                    </li>
                  ))}
                </ul>

                <hr />
              </div>
            ))}
          </div>
        )}
      </div>


      <Footer />
    </>
  );
};

export default OrdersPage;
