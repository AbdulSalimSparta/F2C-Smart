// src/pages/SellerHome.jsx
import React from "react";
import FarmersProductUpload from "../components/FarmersProductUpload";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/SellerHome.css"
import UploadProduct from "../components/UploadProduct";
import FarmerDashboard from "./FarmerDashboard";
import FarmerHeader from "../components/FarmerHeader";

function SellerHome() {
  return (<div className="body">
    <FarmerHeader />
    <div className="container">
      <h1 className="seller-page-headline">Welcome Farmers!</h1>
      <h1 className="seller-page-title">Dashboard</h1>
      <FarmerDashboard />
      <Footer />
    </div></div>
  );
}

export default SellerHome;
