  import React from "react";
  import "../styles/ShoppingCart.css";
  import { useState , useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import Header from "../components/Header";
  import Footer from "../components/Footer";
  import { products } from "../Data/data";
  import axios from "axios";
  import { jwtDecode } from "jwt-decode";
  const ShoppingCart = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  useEffect(() => {
    // Step 1: Get token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Step 2: Decode JWT token to get userId
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);

      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);



  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please log in to view your cart.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/cart/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setMessage("Failed to load cart items.");
      }
    };
    fetchCartItems();
  }, []);

  

    // ✅ Correctly initializing state

    const updateQuantity = async (id, delta) => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please log in to modify your cart.");
        return;
      }
    
      // Update quantity first
      setCartItems(prevItems => prevItems.map(item => 
        item.cart_id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
          : item
      ));
    
      try {
        // Send update request to backend
        await axios.put(
          `http://localhost:5000/api/cart/update/${id}`, 
          { quantity: Math.max(1, cartItems.find(item => item.cart_id === id)?.quantity + delta) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error updating quantity:", error);
        setMessage("Failed to update quantity.");
      }
    };
    


    const removeItem = async (id) => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please log in to modify your cart.");
        return;
      }
    
      try {
        await axios.delete(`http://localhost:5000/api/cart/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        // Only update state if API call is successful
        setCartItems(prevItems => prevItems.filter(item => item.cart_id !== id));
      } catch (error) {
        console.error("Error removing item:", error);
        setMessage("Failed to remove item.");
      }
    };
    

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    console.log("cartitems",cartItems);
  
    const handleChange = (e) => {
      setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };
  
    const handleCheckout = async () => {
      if (!userDetails.fullName || !userDetails.address || !userDetails.city || !userDetails.postalCode || !userDetails.phone) {
          alert("Please fill in all fields.");
          return;
      }
  
      const token = localStorage.getItem("token");
      if (!token) {
          alert("Please log in to proceed.");
          return;
      }
  
      try {
          // **Step 1: Save Address First**
          const addressResponse = await axios.post(
              "http://localhost:5000/api/address",
              {
                  user_id:userId, // Ensure this is correctly set
                  street_address: userDetails.address,
                  city: userDetails.city,
                  postal_code: userDetails.postalCode,
                  phone: userDetails.phone,
                  type: "shipping", // You can modify this based on the address type
              },
              { headers: { Authorization: `Bearer ${token}` } }
          );
  
          const savedAddress = addressResponse.data; // Get the saved address details
  
          // **Step 2: Place Order with Saved Address**
          const orderData = {
            userId: userId, 
            addressId: savedAddress.id, // Fix: Use `savedAddress` from API response
            totalAmount: totalPrice, // Fix: Use `totalPrice`
            cartItems: cartItems.map(item => ({
              productId: item.product_id, // Fix: Ensure correct field name
              quantity: item.quantity,
              price: item.price
            })),
            paymentMethod: "COD"
          };
          
          const orderResponse = await axios.post(
            "http://localhost:5000/api/orders",
            orderData,
            { headers: { Authorization: `Bearer ${token}` } } // Fix: Use `token`
          );
  
          if (orderResponse.data.success) {
              alert("✅ Order placed successfully!");
              localStorage.removeItem("cart"); // Clear cart
              navigate("/order-success"); // Redirect to confirmation page
          }
      } catch (error) {
          console.error("Checkout error:", error);
          alert("❌ Failed to place order. Please try again.");
      }
  };
  
  
    

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
            <div className="cart-item" key={item.cart_id}>
              <img src={item.image_url} alt={item.name} />
              <div className="item-details">
                <h6 className="text-muted">{item.category}</h6>
                <h5 className="text-black">{item.name}</h5>
              </div>
              <div className="quantity">
                <button className="btn" onClick={() => updateQuantity(item.cart_id, - 1)}>-</button>
                <input type="number" value={item.quantity} readOnly />
                <button className="btn" onClick={() => updateQuantity(item.cart_id,  1)}>+</button>
              </div>
              <p className="price">€ {item.price * item.quantity}</p>
              <button className="remove-btn" onClick={() => removeItem(item.cart_id)}>×</button>
            </div>
          ))}
  
          <hr />
          <p><a href="#" className="back-link">← Back to shop</a></p>
        </div>
  
        <div className="checkout-content">
          <h3 className="ckt">Checkout</h3>
          <hr />
          <h5 className="ShA">Shipping Address</h5>
          <input type="text" name="fullName" placeholder="Full Name" value={userDetails.fullName} onChange={handleChange} />
          <input type="text" name="address" placeholder="Street Address" value={userDetails.address} onChange={handleChange} />
          <input type="text" name="city" placeholder="City" value={userDetails.city} onChange={handleChange} />
          <input type="text" name="postalCode" placeholder="Postal Code" value={userDetails.postalCode} onChange={handleChange} />
          <input type="text" name="phone" placeholder="Phone Number" value={userDetails.phone} onChange={handleChange} />
          <hr />
          <div className="total">
            <p>Total</p>
            <p>₹ {totalPrice.toFixed(2)}</p>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>Proceed to Payment</button>
        </div>
      </section>
      <Footer />
      </>);
  };
  
  export default ShoppingCart;
  