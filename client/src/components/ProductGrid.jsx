import React from 'react';
import ProductCard from './ProductCard';
import '../styles/ProductCard.css'; // Importing the separate component
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Product data (Can be fetched from API)
const products = [
  { id: 'veg-1', name: 'Fresh Tomatoes', category: 'Vegetables', price: '$1.99 / lb', imageUrl: 'https://www.pngarts.com/files/3/Sliced-Tomato-Free-PNG-Image.png' },
  { id: 'fruit-1', name: 'Organic Apples', category: 'Fruits', price: '$3.99 / lb', imageUrl: 'https://png.pngtree.com/png-clipart/20231118/original/pngtree-fresh-harvest-of-apples-png-image_13629745.png' },
  { id: 'agro-1', name: 'Onion', category: 'Vegetables', price: '$19.99 / Kg', imageUrl: 'https://www.maatarafruitscompany.com/wp-content/uploads/2022/06/istockphoto-184781848-612x612-1.jpg' },
  { id: 'veg-2', name: 'Carrot', category: 'Vegetables', price: '$1.99 / lb', imageUrl: 'https://th.bing.com/th/id/R.87c21222875469046d481534e8a92f3f?rik=1eKEY%2bLiMVpikg&riu=http%3a%2f%2fwww.freepngimg.com%2fdownload%2fcarrot%2f4-2-carrot-png.png&ehk=fmuxovmcoHNLVyzeqXT41lSZ3vUwthhdSHeAOZaqO00%3d&risl=&pid=ImgRaw&r=0' },
  { id: 'fruit-2', name: 'Milk', category: 'Dairy Products', price: '$3.99 / lb', imageUrl: 'https://png.pngtree.com/png-clipart/20240323/original/pngtree-milk-bottle-dairy-product-png-image_14657285.png' },
  { id: 'agro-2', name: 'Walnut', category: 'Nuts', price: '$19.99 / bag', imageUrl: 'https://th.bing.com/th/id/OIP.d7YVdXpFKVz8BjowRDCmbwHaGo?rs=1&pid=ImgDetMain' },
  { id: 'fruit-3', name: 'Wheat', category: 'Grains', price: '$3.99 / lb', imageUrl: 'https://png.pngtree.com/png-clipart/20220109/original/pngtree-whole-grains-png-image_7025009.png' },
  { id: 'agro-3', name: 'Almonds', category: 'Nuts', price: '$19.99 / bag', imageUrl: 'https://th.bing.com/th/id/R.ff53fa7796675b36393cdd2d9c92da16?rik=SGIWD1zx4dKo0w&riu=http%3a%2f%2fpngimg.com%2fuploads%2falmond%2falmond_PNG11.png&ehk=jsic6XpmpideIIeoMtdE8HjnEStJldjkmT9q%2fhx2few%3d&risl=&pid=ImgRaw&r=0' },
];

const ProductGrid = () => {
  return (
    <div className="product-grid-container">
      <div className="container">
        <div className="ProductsTitle">
          <img width="24" height="24" src="https://img.icons8.com/material-outlined/24/40C057/shopping-cart--v1.png" alt="shopping-cart--v1" />
          <h5>Shop By Products</h5>
        </div>
        <div className="row">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
