import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import db from "./database/db.js";
import productRoutes from "./routes/productRoutes.js"; 
import categoryRoutes from "./routes/categoryRoutes.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import farmerRoutes from "./routes/farmerRoutes.js"



dotenv.config();
const app = express();
const port = 5000;

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes ,authenticateToken);
app.use("/api", addressRoutes);
app.use('/admin', adminRoutes);
app.use('/api/farmer', farmerRoutes);

app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the product details
  
  const query = `
      SELECT 
        p.*, 
        c.name AS category_name, 
        u.username AS seller_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.id = $1
      AND approved IS true
    `;

const productResult = await db.query(query, [id]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Fetch reviews for the product
    const reviewsResult = await db.query("SELECT * FROM reviews WHERE product_id = $1 ORDER BY created_at DESC", [id]);

    res.json({
      product: productResult.rows[0],
      reviews: reviewsResult.rows,  // Return the list of reviews
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/products/:id/reviews", async (req, res) => {
  const { id } = req.params; // Product ID
  const { userId, rating, comment ,image} = req.body; // Extract user input

  // Validate input
  if (!userId || !rating || !comment) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO reviews (product_id, user_id, rating, comment,image) VALUES ($1, $2, $3, $4,$5) RETURNING *",
      [id, userId, rating, comment,image]
    );

    res.status(201).json({ success: true, review: result.rows[0] });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/api/user/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    // Fetch username from database
    const user = await db.query("SELECT username FROM users WHERE id = $1", [userId]);

    if (user.rows.length === 0) return res.status(404).json({ message: "User not found" });

    res.json({ username: user.rows[0].username }); // Send username to frontend
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

