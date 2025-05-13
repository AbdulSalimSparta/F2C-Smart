export const getCartItems = async (req, res) => {
  const userId = req.user.userId; // Extract from JWT token

  try {
      const cartItems = await db.query(
          `SELECT cart.id AS cart_id, cart.quantity, 
                  products.id AS product_id, products.name, 
                  products.price, products.image_url
           FROM cart
           INNER JOIN products ON cart.product_id = products.id
           WHERE cart.user_id = $1`,
          [userId]
      );
      console.log("Cart Items Fetched:", cartItems.rows); 
      res.json(cartItems.rows);
  } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Server error" });
  }
};
