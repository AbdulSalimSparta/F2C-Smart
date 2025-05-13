import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/OrderSuccess.css";
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (<>
 
    <Header />
    <div className="container order-success">

      <div className="order-thanks">
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your order. You will receive a confirmation email shortly.</p>
        <button > <Link to="/orders" className="back">See your Orders</Link></button>
      </div>
      
      
    </div>
    <Footer />
    </>

  );
};

export default OrderSuccess;
