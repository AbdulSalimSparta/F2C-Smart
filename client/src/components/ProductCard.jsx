import React from 'react';
import '../styles/ProductCard.css'; // Scoped styles

const ProductCard = ({ product }) => {
  return (
    <div className="col-md-4 col-lg-3 col-sm-6 product-card">
      <div className="card">
        <img src="../Images/f2c_logo 1.svg" alt="logo" width="40" height="40" />
        <img src={product.imageUrl} alt={product.name} className="card-img-top product-image" />
        <div className="Productcont">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-category">{product.category}</p>
          <div className="Pricecont">
            <p className="card-price-text">Price:</p>
            <p className="card-price">{product.price}</p>
          </div>
        </div>
        <div className="card-buttons">
          <button className="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
