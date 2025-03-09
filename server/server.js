import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import env from "dotenv";

env.config();

// Developed By Abdul Saleem (abdulsaleem.cse21@mamcet.com)

// PostgreSQL Client Setup
const db = new pg.Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

db.connect();

// Initialize Express App
const app = express();
const port = 5000;
let currentUserId = '';  // Store the current user's ID for profile-related operations

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());  // Enable CORS for cross-origin requests

// Secret key for JWT (replace in production)
const SECRET_KEY = process.env.SECRET__KEY;

// Routes

// User Registration
app.post('/api/register', async (req, res) => {
  const { email, password, username } = req.body;
  try {
    // Hash the password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const result = await db.query(
      "INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING id",
      [email, hashedPassword, username]
    );

    // Generate a JWT token for the registered user
    const token = jwt.sign({ userId: result.rows[0].id }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Retrieve the user by email
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    currentUserId = user.id;

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    currentUserId = user.userId;  // Update the current user's ID
    next();
  });
};

// Protected Route Example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", userId: req.user.userId });
});

// Public Routes

// Example route to fetch lab resources
app.get('/api', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM lab_resources");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching lab resources:", error);
    res.status(500).json({ message: "Error fetching lab resources", error: error.message });
  }
});

// Route to fetch IoT components
app.get('/api/resources', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM iot_components");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching IoT components:", error);
    res.status(500).json({ message: "Error fetching IoT components", error: error.message });
  }
});

// Route to fetch current user's data
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [currentUserId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data", error: error.message });
  }
});

// 404 Error Handling for Unmatched Routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Developed By Abdul Saleem (abdulsaleem.cse21@mamcet.com)
