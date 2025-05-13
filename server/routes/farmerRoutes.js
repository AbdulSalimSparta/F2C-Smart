import express from "express";
const router = express.Router();
import db from "../database/db.js";  // Ensure path is correct
import { authenticateToken } from "../middleware/authMiddleware.js";

// POST route to add a product (requires authentication)
router.post('/add-product', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  console.log(userId);
  const { name, category_id, price, stock, description, image_url  } = req.body;
  // Extracted from JWT token

  if (!name || !category_id || !price || !stock || !description || !image_url || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await db.query(`
      INSERT INTO products (name, category_id, price, stock, description, image_url, seller_id, approved, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, false, CURRENT_TIMESTAMP)
    `, [name, category_id, price, stock, description, image_url, userId]);

    res.status(201).json({ message: 'Product submitted for admin approval' });
  } catch (err) {
    console.error('Product insert failed:', err);
    res.status(500).json({ error: 'Error uploading product' });
  }
});

export default router;
