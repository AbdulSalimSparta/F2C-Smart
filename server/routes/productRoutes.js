import express from "express";
import db from "../database/db.js";  // Ensure this path is correct

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.*, 
        c.name AS category_name, 
        u.username AS seller_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
    `);  // Ensure this table exists in DB
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});




export default router;
