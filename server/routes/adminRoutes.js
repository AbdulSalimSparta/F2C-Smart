import express from "express";
import db from "../database/db.js";  // adjust path if needed

const router = express.Router();

router.get("/metrics", async (req, res) => {
  try {
    const [
      totalRevenue,
      totalUsers,
      totalSellers,
      totalProducts,
      pendingOrders,
      monthlyRevenue,
      topProducts
    ] = await Promise.all([
      db.query(`SELECT SUM(total_price) AS total_revenue FROM orders WHERE status IN ('pending', 'completed')`),
      db.query(`SELECT COUNT(*) AS total_users FROM users WHERE role = 'customer'`),
      db.query(`SELECT COUNT(*) AS total_sellers FROM users WHERE role = 'seller'`),
      db.query(`SELECT COUNT(*) AS total_products FROM products`),
      db.query(`SELECT COUNT(*) AS pending_orders FROM orders WHERE status = 'pending'`),
      db.query(`
        SELECT 
          TO_CHAR(created_at, 'Month') AS month,
          SUM(total_price) AS revenue
        FROM orders
        WHERE status IN ('pending', 'completed')
        GROUP BY month, EXTRACT(MONTH FROM created_at)
        ORDER BY EXTRACT(MONTH FROM created_at)
      `),
      db.query(`
        SELECT 
          name,
          COUNT(order_items.product_id) AS order_count
        FROM order_items
        JOIN products ON order_items.product_id = products.id
        GROUP BY name
        ORDER BY order_count DESC
        LIMIT 5
      `)
    ]);

    res.json({
      totalRevenue: totalRevenue.rows[0].total_revenue || 0,
      totalUsers: totalUsers.rows[0].total_users || 0,
      totalSellers: totalSellers.rows[0].total_sellers || 0,
      totalProducts: totalProducts.rows[0].total_products || 0,
      pendingOrders: pendingOrders.rows[0].pending_orders || 0,
      monthlyRevenue: monthlyRevenue.rows,
      topProducts: topProducts.rows,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
