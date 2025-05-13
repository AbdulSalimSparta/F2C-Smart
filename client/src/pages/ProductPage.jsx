import { useState , useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/ProductPage.css";
import { fetchProductById } from "../Data/data";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";






const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]); // Fetch reviews from backend
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "", image: "" });
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState('');
  const [showNotification, setShowNotification] = useState('');
  
  useEffect(() => {
    // Step 1: Get token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Step 2: Decode JWT token to get userId
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);

        // Step 3: Fetch username from backend
        axios
          .get(`http://localhost:5000/api/user/${decoded.userId}`, {
            headers: { Authorization: `Bearer ${token}` }, // Send token for authentication
          })
          .then((res) => setUsername(res.data.username))
          .catch((err) => console.error("Error fetching user:", err));

      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);


  const handleQuantityChange = (value) => {
    setQuantity(value);
  };


  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(productId); 
        setProduct(data.product);
        setReviews(data.reviews); // Fetch reviews from backend
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [productId]);


  // Handle Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    const reviewData = {
      userId: userId, 
      name:newReview.name,// Make sure `user.id` is defined
      rating: parseInt(newReview.rating, 10), // Ensure rating is a number
      comment: newReview.comment,
      image: newReview.image||"", // Ensure image is always a string
      
    };
  
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");
  
      console.log("✅ Review submitted:", data);
    } catch (error) {
      console.error("❌ Error submitting review:", error);
    }
  };
  

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewReview({ ...newReview, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };


    // Handle cart Submission
    const handleAddToCart = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);  // ✅ Check if token is valid
      console.log("Product ID:", product.id); // ✅ Check if product.id is valid
    
      if (!token) {
        setMessage("Please log in to add items to the cart.");
        setMessageType("error");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false); // Hide after 10 seconds
        }, 5000);
        return;
      }
    
      try {
        const response = await axios.post(
          "http://localhost:5000/api/cart/add",
          { productId: product.id, quantity: quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
    
        console.log("Response:", response.data); // ✅ Check backend response
        setMessage(response.data.message);
        setMessageType("success");  // Indicating success
        setShowNotification(true);
    
        setTimeout(() => {
          setShowNotification(false); // Hide after 10 seconds
        }, 5000);
      } catch (error) {
        console.error("Error:", error.response?.data || error); // ✅ Log exact error
        setMessage(error.response?.data?.message || "Failed to add to cart.");
        setMessageType("error");  // Indicating error
        setShowNotification(true);
    
        setTimeout(() => {
          setShowNotification(false); // Hide after 10 seconds
        }, 5000);
      }
    };
    
    
    
  

  console.log(username);
  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!product) return <h2>Product Not Found</h2>;

  
  return (
    <>
      <Header />
      <div className="container product-container">
        {showNotification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: messageType === "success" ? "green" : "red",
            color: "white",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            opacity: 1,
            transition: "opacity 0.5s ease-out",
          }}
        >
          {message}
        </div>
      )}

        {/* Product Hero Section */}
        <div className="product-hero">
          <div className="product-imagepage">
            <img src={product.image_url} alt={product.name} />
          </div>
          <div className="product-details">
            <h6 className="category">{product.category_name}</h6>
            <h1 className="product-title">{product.name}</h1>
            <h4 className="price">₹ {product.price} Rs</h4>
            <span className="AboutProduct">
              <p><b>About :</b> The tomato (Solanum lycopersicum) is a flowering plant of the nightshade 
                family, cultivated extensively for its edible fruits. Although labelled as
                a vegetable, tomatoes are technically a botanical fruit and specifically a 
                berry. They are shiny and smooth, with many small seeds, and are a good 
                source of vitamin C and the phytochemical lycopene. Tomatoes are generally 
                much branched, have hairy, strongly odorous, feathery leaves, and produce
                  yellow flowers that develop into red berries as they mature.</p>
            </span>
            <div className="quantity-box">
              <h5>Choose Quantity </h5>
              <input
                    className="quantity-input"
                    type="number"
                    placeholder="Quantiy"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
              />
              {/* <input type="number" value={quantity} readOnly className="" /> */}
              {/* <span className="quantiy-btn-spanbox">
                <button className="quantity-btn-1" onClick={() => handleQuantityChange(-1)}>-</button>
                <button className="quantity-btn-2" onClick={() => handleQuantityChange(1)}>+</button>
              </span> */}
              {/* <div className="weight-options">
                {productData.weightOptions.map((weight, index) => (
                  <button key={index}>{weight}</button>
                ))}
              </div> */}
            </div>
            <div className="cartandprice-btn">
              <button className="add-to-cart" onClick={handleAddToCart}>Add To Cart</button>
              <button className="add-to-cart">Price history</button>
            </div>
            
            <div className="product-info">
            <table width="100%">
              <tbody>
                <tr>
                  <th>Product Code</th>
                  <td>{product.id}</td>
                </tr>
                <tr>
                  <th>Availability</th>
                  <td>{product.stock}</td>
                </tr>
                <tr>
                  <th>Type</th>
                  <td>{product.category}</td>
                </tr>
                <tr>
                  <th>Shipping</th>
                  <td>{product.id}</td>
                </tr>
              </tbody>
            </table>

            </div>
          </div>
        </div>
        <hr />
        {/* Product Description */}
        <div className="container product-section-description">
          <h2>Product Description</h2>
          <p>{product.description}</p>
        </div>
        <hr />
        {/* Farmer Details */}
        <div className="container product-section-farmerdetails">
          <h2>Farmer Details</h2>
          <p><strong>Name:</strong> {product.seller_name}</p>
          <p><strong>Farm Location:</strong> {product.name}</p>
          <p><strong>Farming Practices:</strong> {product.name}</p>
        </div>
        <hr />
        {/* Customer Reviews */}
        <div className="container product-section">
          <h2>Customer Reviews</h2>
          {reviews.map((review, index) => (
            <div key={index} className="review">
               {/* {review.name} */}
              <p><strong>Anonymous User:</strong> {"⭐".repeat(review.rating)}</p>
              {review.image && <img src={review.image} alt="Review" className="review-image" height="100" width="100" />}
              <p>{review.comment}</p>
            </div>
          ))}
          {/* Write a Review */}
          <div className="container review-form">
            <h3>Write a Review</h3> 
            <input
              type="text"
              placeholder="Your Name"
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            />
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} Stars
                </option>
              ))}
            </select>
            <textarea
              placeholder="Your Review"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <button onClick={handleReviewSubmit}>Submit Review</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
