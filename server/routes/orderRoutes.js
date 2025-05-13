import express from "express";
import db from "../database/db.js";  // Ensure correct path to your database file
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Place an order
router.post("/", authenticateToken, async (req, res) => {
    console.log("Received Order Data:", req.body); // Log request data
    
    const { userId, cartItems, totalAmount, addressId, paymentMethod } = req.body;
  
    if (!userId || !cartItems || cartItems.length === 0 || !totalAmount || !addressId) {
      console.error("Missing required fields:", req.body);
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      const orderResult = await db.query(
        "INSERT INTO orders (user_id, total_price, address_id, payment_method) VALUES ($1, $2, $3, $4) RETURNING id",
        [userId, totalAmount, addressId, paymentMethod]
      );
  
      const orderId = orderResult.rows[0].id;
  
      for (const item of cartItems) {
        await db.query(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
          [orderId, item.productId, item.quantity, item.price]
        );
      }

      await db.query("DELETE FROM cart WHERE user_id = $1", [userId]);
  
      res.status(201).json({ success: true, orderId });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ message: "Server error" });
    }
  });


router.get("/:userId", authenticateToken, async (req, res) => {
    const { userId } = req.params;
    console.log("Fetching orders for userId:", userId);

    try {
        const orders = await db.query(
            `SELECT o.*, 
                    COALESCE(json_agg(
                        CASE 
                            WHEN oi.product_id IS NOT NULL THEN 
                                json_build_object(
                                    'product_id', oi.product_id, 
                                    'name', p.name, 
                                    'quantity', oi.quantity, 
                                    'price', oi.price
                                )
                            ELSE NULL
                        END
                    ) FILTER (WHERE oi.product_id IS NOT NULL), '[]') AS items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC`,
            [userId]
        );
        

        if (orders.rows.length === 0) {
            console.warn("No orders found for userId:", userId);
            return res.status(404).json({ message: "No orders found" });
        }

        res.json(orders.rows);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server error" });
    }
});



export default router;
