import React, { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from './ProductCard';
import '../styles/ProductCard.css'; // Importing the separate component
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { fetchProducts } from '../Data/data';

const ProductGrid = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const data = await fetchProducts();
            setProducts(data);
        };

        getProducts();
    }, []);

    console.log(products);
  return (
    <div className="product-grid-container">
      <div className="container">
        <div className="ProductsTitle">
          <img width="24" height="24" src="https://img.icons8.com/material-outlined/24/40C057/shopping-cart--v1.png" alt="shopping-cart--v1" />
          <h5>Shop By Products</h5>
        </div>
        <div className="row">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onClick={() => navigate(`/products/${product.id}`)} style={{ cursor: "pointer" }}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
