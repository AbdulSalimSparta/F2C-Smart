import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import db from "../database/db.js";

const router = express.Router();

// Fetch Current User Data
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [req.user.userId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data", error: error.message });
  }
});

export default router;
