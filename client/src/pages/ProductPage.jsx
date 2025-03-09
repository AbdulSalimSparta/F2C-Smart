import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/ProductPage.css";

const productData = {
  id: "FBB00255",
  name: "Tomato",
  category: "Vegetables",
  price: 50,
  image: "https://www.pngarts.com/files/3/Sliced-Tomato-Free-PNG-Image.png",
  weightOptions: ["500 G", "1 KG"],
  availability: "In Stock",
  type: "Fruits",
  shipping: "01 day shipping. (Free pickup today)",
  description:
    "Fresh and juicy tomatoes directly sourced from local farms. Rich in vitamins and antioxidants, these tomatoes are perfect for salads, cooking, and sauces.",
  farmer: {
    name: "Ramesh Kumar",
    location: "Tamil Nadu, India",
    practices: "Organic, Pesticide-Free",
  },
};

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([
    { name: "Amit Sharma", rating: 5, comment: "Very fresh and tasty!", image: "" },
    { name: "Pooja Verma", rating: 4, comment: "Nice quality. Slightly small.", image: "" },
  ]);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "", image: "" });

  const handleQuantityChange = (value) => {
    setQuantity((prev) => Math.max(1, prev + value));
  };

  const handleReviewSubmit = () => {
    if (newReview.name && newReview.comment) {
      setReviews([...reviews, newReview]);
      setNewReview({ name: "", rating: 5, comment: "", image: "" });
    }
  };

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

  return (
    <>
      <Header />
      <div className="container product-container">
        {/* Product Hero Section */}
        <div className="product-hero">
          <div className="product-image">
            <img src={productData.image} alt={productData.name} />
          </div>
          <div className="product-details">
            <h6 className="category">{productData.category}</h6>
            <h1 className="product-title">{productData.name}</h1>
            <h4 className="price">₹ {productData.price} Rs</h4>
            <hr />
            <div className="weight-options">
              {productData.weightOptions.map((weight, index) => (
                <button key={index}>{weight}</button>
              ))}
            </div>
            <div className="quantity-box">
              <button className="quantity-btn" onClick={() => handleQuantityChange(-1)}>-</button>
              <input type="number" value={quantity} readOnly className="quantity-input" />
              <button className="quantity-btn" onClick={() => handleQuantityChange(1)}>+</button>
            </div>
            <button className="add-to-cart">Add To Cart</button>
            <div className="product-info">
              <p><strong>Product Code:</strong> {productData.id}</p>
              <p><strong>Availability:</strong> {productData.availability}</p>
              <p><strong>Type:</strong> {productData.type}</p>
              <p><strong>Shipping:</strong> {productData.shipping}</p>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="product-section">
          <h2>Product Description</h2>
          <p>{productData.description}</p>
        </div>

        {/* Farmer Details */}
        <div className="product-section">
          <h2>Farmer Details</h2>
          <p><strong>Name:</strong> {productData.farmer.name}</p>
          <p><strong>Farm Location:</strong> {productData.farmer.location}</p>
          <p><strong>Farming Practices:</strong> {productData.farmer.practices}</p>
        </div>

        {/* Customer Reviews */}
        <div className="product-section">
          <h2>Customer Reviews</h2>
          {reviews.map((review, index) => (
            <div key={index} className="review">
              <p><strong>{review.name}:</strong> {"⭐".repeat(review.rating)}</p>
              {review.image && <img src={review.image} alt="Review" className="review-image" />}
              <p>{review.comment}</p>
            </div>
          ))}
          {/* Write a Review */}
          <div className="review-form">
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
