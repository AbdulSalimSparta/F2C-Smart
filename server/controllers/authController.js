import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../database/db.js";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET__KEY;

// 🔹 User Registration
export const registerUser = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (email, password, username, role) VALUES ($1, $2, $3, $4) RETURNING id, role",
      [email, hashedPassword, username, "customer"]  // Default role = customer
    );

    const token = jwt.sign({ userId: result.rows[0].id, role: result.rows[0].role }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "User registered successfully", token, role: result.rows[0].role });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

// 🔹 User Login
export const loginUser = async (req, res) => {
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

    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
