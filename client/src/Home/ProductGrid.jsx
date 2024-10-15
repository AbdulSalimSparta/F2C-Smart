import React from 'react';
import './ProductCard.css'; // Custom styles for cards
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Product data (can be fetched from API in real apps)
const products = [
  {
    id: 'veg-1',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: '$1.99 / lb',
    imageUrl: 'https://th.bing.com/th/id/OIP.P0kFHeTdC0DtZ49pZRRmQAHaEs?rs=1&pid=ImgDetMain',
  },
  {
    id: 'fruit-1',
    name: 'Organic Apples',
    category: 'Fruits',
    price: '$3.99 / lb',
    imageUrl: 'https://png.pngtree.com/png-clipart/20231118/original/pngtree-fresh-harvest-of-apples-png-image_13629745.png',
  },
  {
    id: 'agro-1',
    name: 'Organic Fertilizer',
    category: 'Agro Products',
    price: '$19.99 / bag',
    imageUrl: 'https://th.bing.com/th/id/R.12609fe07b5d94241378c144e306479e?rik=T3IsvCrNIfWPpA&riu=http%3a%2f%2fsapphireagriculture.com%2fwp-content%2fuploads%2f2017%2f06%2ffertiplus-433-big-500x360.png&ehk=eKiQTQCNar2%2f%2b2zQYzToXdkgqeL0KMwmtiJZJVPUYRo%3d&risl=&pid=ImgRaw&r=0',
  },
  // Add more products
  {
    id: 'veg-1',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: '$1.99 / lb',
    imageUrl: 'https://th.bing.com/th/id/OIP.P0kFHeTdC0DtZ49pZRRmQAHaEs?rs=1&pid=ImgDetMain',
  },
  {
    id: 'fruit-1',
    name: 'Organic Apples',
    category: 'Fruits',
    price: '$3.99 / lb',
    imageUrl: 'https://png.pngtree.com/png-clipart/20231118/original/pngtree-fresh-harvest-of-apples-png-image_13629745.png',
  },
  {
    id: 'agro-1',
    name: 'Organic Fertilizer',
    category: 'Agro Products',
    price: '$19.99 / bag',
    imageUrl: 'https://example.com/fertilizer.jpg',
  },
];

// Product Card Component
const ProductCard = ({ product }) => {
  return (
    <div className="col-md-4 col-lg-3 col-sm-6 product-card">
      <div className="card">
        <img src={product.imageUrl} alt={product.name} className="card-img-top product-image" />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-category">{product.category}</p>
          <p className="card-price">{product.price}</p>
          <div className="card-buttons">
            <button className="btn btn-success add-to-cart">Add to Cart</button>
            <button className="btn btn-outline-secondary wishlist"><i className="fas fa-heart"></i></button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Grid Section
const ProductGrid = () => {
  return (
    <div className="container">
        <div className="ProductsTitle">
                <img width="24" height="24" src="https://img.icons8.com/material-outlined/24/40C057/shopping-cart--v1.png" alt="shopping-cart--v1"/>
                    <h5>Shop By Products</h5>
        </div>
        <div className="row">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    </div>
  );
};

export default ProductGrid;
