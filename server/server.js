import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

// Developed By Abdul Saleem (abdulsaleem.cse21@mamcet.com)

const db = new pg.Client({// Replace values to coonect with Database
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});
db.connect();

const app = express();
const port = 5000;
let currentUserId = '';  // Variable to store the current user's ID

// Middleware to parse JSON requests
app.use(express.json());

const SECRET_KEY = process.env.SECRET__KEY; // Replace with a secure key in production

// User Registration
app.post('/api/register', async (req, res) => {
  const { email, password, username, question } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await db.query("INSERT INTO users (email, password, username, annaunivstudent) VALUES ($1, $2, $3, $4) RETURNING id", [email, hashedPassword, username, question]);
    const token = jwt.sign({ userId: result.rows[0].id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    currentUserId = user.id;  // Set the current user's ID
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Middleware to verify token
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
app.get('/api', async(req, res) => {
    const result = await db.query("SELECT * FROM lab_resources");
    res.json(result.rows);
});

app.get('/api/resources', async(req, res) => {
  const result = await db.query("SELECT * FROM iot_components");
  res.json(result.rows);
});

app.get('/api/user', async(req, res) => {
  const result = await db.query("SELECT * FROM users WHERE id=($1)",[currentUserId]);
  res.json(result.rows[0]);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Developed By Abdul Saleem (abdulsaleem.cse21@mamcet.com)