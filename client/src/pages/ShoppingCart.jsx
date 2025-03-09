  import React from "react";
  import "../styles/ShoppingCart.css";
  import { useState } from "react";
  import Header from "../components/Header";
  import Footer from "../components/Footer";
  
  const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([
      { id: 1, name: "Tomato", price: 50, quantity: 1, image: 'https://www.pngarts.com/files/3/Sliced-Tomato-Free-PNG-Image.png' ,category:"Vegetables"},
      { id: 2, name: "Onion", price: 40, quantity: 1, image: 'https://www.maatarafruitscompany.com/wp-content/uploads/2022/06/istockphoto-184781848-612x612-1.jpg',category:"Vegetables" },
      { id: 3, name: "Milk", price: 23, quantity: 1, image: 'https://png.pngtree.com/png-clipart/20240323/original/pngtree-milk-bottle-dairy-product-png-image_14657285.png',category:"Dairy Products" },
    ]);
  
    const updateQuantity = (id, delta) => {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      ));
    };
  
    const removeItem = (id) => {
      setCartItems(cartItems.filter(item => item.id !== id));
    };
  
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
    return (<>
      <Header />
      <section className="cart-container">
        <div className="cart-content">
          <span className="ShpItemstxt">
          <h2>Shopping Cart</h2>
          <h6>{cartItems.length} items</h6>
          </span>
          <hr />
  
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h6 className="text-muted">{item.category}</h6>
                <h5 className="text-black">{item.name}</h5>
              </div>
              <div className="quantity">
                <button className="btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                <input type="number" value={item.quantity} readOnly />
                <button className="btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>
              <p className="price">€ {item.price * item.quantity}</p>
              <button className="remove-btn" onClick={() => removeItem(item.id)}>×</button>
            </div>
          ))}
  
          <hr />
          <p><a href="#" className="back-link">← Back to shop</a></p>
        </div>
  
        <div className="checkout-content">
          <h3 className="ckt">Checkout</h3>
          <hr />
          <h5 className="ShA">Shipping Address</h5>
          <input type="text" placeholder="Full Name" />
          <input type="text" placeholder="Street Address" />
          <input type="text" placeholder="City" />
          <input type="text" placeholder="Postal Code" />
          <input type="text" placeholder="Phone Number" />
          <hr />
          <div className="total">
            <p>Total</p>
            <p>€ {totalPrice.toFixed(2)}</p>
          </div>
          <button className="checkout-btn">Proceed to Payment</button>
        </div>
      </section>
      <Footer />
      </>);
  };
  
  export default ShoppingCart;
  