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


// Update Product (also needs admin re-approval)
router.put("/update-product/:id", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const productId = req.params.id;
  const { name, category_id, price, stock, description, image_url } = req.body;

  try {
    const result = await db.query(
      `UPDATE products
       SET name = $1, category_id = $2, price = $3, stock = $4, description = $5, image_url = $6, approved = false
       WHERE id = $7 AND seller_id = $8`,
      [name, category_id, price, stock, description, image_url, productId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: "Unauthorized or product not found" });
    }

    res.json({ message: "Product updated and sent for admin re-approval" });
  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Get My Products
router.get("/my-products/", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await db.query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE seller_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch Products Error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get Dashboard Metrics
router.get("/metrics", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const revenueRes = await db.query(
      `SELECT COALESCE(SUM(oi.quantity * oi.price), 0) AS total_revenue
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE p.seller_id = $1`,
      [userId]
    );

    const productCountRes = await db.query(
      `SELECT COUNT(*) FROM products WHERE seller_id = $1`,
      [userId]
    );

    const pendingApprovalRes = await db.query(
      `SELECT COUNT(*) FROM products WHERE seller_id = $1 AND approved = false`,
      [userId]
    );

    const orderCountRes = await db.query(
      `SELECT COUNT(DISTINCT o.id)
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE p.seller_id = $1`,
      [userId]
    );

    res.json({
      revenue: revenueRes.rows[0].total_revenue,
      total_products: productCountRes.rows[0].count,
      pending_approval: pendingApprovalRes.rows[0].count,
      total_orders: orderCountRes.rows[0].count,
    });
  } catch (err) {
    console.error("Metrics Error:", err);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

// Sales History
router.get("/sales-history", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await db.query(
      `SELECT o.id AS order_id, o.status, o.created_at, oi.quantity, oi.price,
              p.name AS product_name, u.username AS buyer_name
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       JOIN users u ON o.user_id = u.id
       WHERE p.seller_id = $1
       ORDER BY o.created_at DESC`,
      [userId]
    );
    console.log("Sales History",result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Sales History Error:", err);
    res.status(500).json({ error: "Failed to fetch sales history" });
  }
});

// GET route to fetch seller's pending approval products
router.get('/pending-approvals', authenticateToken, async (req, res) => {
  const sellerId = req.user.userId;

  try {
    const result = await db.query(
      'SELECT * FROM products WHERE seller_id = $1 AND approved = false ORDER BY created_at DESC',
      [sellerId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;

