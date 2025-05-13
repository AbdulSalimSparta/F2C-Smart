// src/pages/SellerHome.jsx
import React from "react";
import FarmersProductUpload from "../components/FarmersProductUpload";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/SellerHome.css"

function SellerHome() {
  return (
    <div>
      <Header/>
      <h1 className="seller-page-title">Welcome Seller/Farmer!</h1>
      <FarmersProductUpload />
      <Footer />
    </div>
  );
}

export default SellerHome;
