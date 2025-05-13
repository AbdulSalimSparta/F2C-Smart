import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchCategories } from "../Data/data";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import '../styles/ProductCard.css'; 
import "../styles/CategoryDisplay.css"


function CategoryDisplay() {
 const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  // Fetch Categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        console.log("Fetched Categories:", data);  // Debugging
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  // Fetch Products when category changes or filters update
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams({
          search: searchQuery,
          minPrice: Number(minPrice),  // Ensure number format
          maxPrice: Number(maxPrice),
        }).toString();

        console.log(`Fetching: /api/categories/${selectedCategory}/products?${queryParams}`);

        const response = await fetch(`http://localhost:5000/api/categories/${selectedCategory}/products?${queryParams}`);
        if (!response.ok) throw new Error(`Server Error: ${response.status}`);

        const data = await response.json();
        console.log("Fetched Products:", data);  // Debugging
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, minPrice, maxPrice]);

  return (
    <>
      <Header />
        <div className="container">
            {/* Search & Filter */}
            <div className="filter-layout">
                <div className="filters">
                <input
                    className="search"
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <input
                    className="pricef"
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                    className="pricef"
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
                </div>
            </div>
        <div className="display-section">
            <div className="category-layout">
                {/* Category List */}
                <div className="category-list">
                {categories.map((category) => (
                <div key={category.id} 
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "active" : ""}>
                  <div className="categories-controllbox" >
                    <div className="image-circle">
                        <img src={category.imageurl} alt={category.name} />
                    </div>
                    <h4>{category.name}</h4>
                    </div>
                  </div>
                ))}
                </div>
            </div>
                {/* Product Grid */}
                <div className="product-layout">
                    <div className="product-grid-container row">
                    {products.length > 0 ? (
                        products.map((product) => (
                        <ProductCard key={product.id} product={product} onClick={() => navigate(`/products/${product.id}`)} style={{ cursor: "pointer" }}/>
                        ))
                    ) : (
                        <p>No products found.</p>
                    )}
                    </div>
                </div>
            </div>
        </div>
      <Footer />
    </>
  );
}

export default CategoryDisplay;
