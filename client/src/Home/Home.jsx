import React from "react";
import Header from "../Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import CategoryRoller from "./CategoryRoller";
import Jumpotron from "./Jumpotron";

import ProductGrid from "./ProductGrid";
import Footer from "../Footer";

function Home(){
  return (
    <>
      <Header />
      <Jumpotron />
      <CategoryRoller />
      <ProductGrid />
      <Footer />
    </>
  );
}

export default Home;