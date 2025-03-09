import React from "react";
import Header from "../components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import CategoryRoller from "../components/CategoryRoller";
import Hero from "../components/Hero";

import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

function Home(){
  return (
    <>
      <Header />
      <Hero />
      <CategoryRoller />
      <ProductGrid />
      <Footer />
    </>
  );
}

export default Home;