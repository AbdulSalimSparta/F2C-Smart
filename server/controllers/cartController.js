import db from "../database/db.js"; // Import your database connection

// ✅ Add Product to Cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.userId; // Extracted from JWT token
  console.log(userId);
  try {
    // Check if the product exists
    const product = await db.query("SELECT * FROM products WHERE id = $1 AND approved IS true", [productId]);
    if (product.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product is already in the cart
    const cartItem = await db.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );

    if (cartItem.rows.length > 0) {
      // Update quantity if product already exists in the cart
      await db.query(
        "UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3",
        [quantity, userId, productId]
      );
    } else {
      // Insert new cart item
      await db.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)",
        [userId, productId, quantity]
      );
    }

    res.json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};




export const getCartItems = async (req, res) => {
    const userId = req.user.userId; // Extract userId from JWT token
    console.log("userid",userId);
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
      
  
      res.json(cartItems.rows);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Server error" });
    }
  };





  export const updateCartQuantity = async (req, res) => {
    const { id } = req.params;
    let { quantity } = req.body;
  
    console.log("Updating Cart - ID:", id, "Quantity:", quantity);
  
    if (!id || !quantity) {
      return res.status(400).json({ message: "Invalid cart item ID or quantity" });
    }
  
    try {
      quantity = parseInt(quantity, 10); // ✅ Convert quantity to an integer
      if (isNaN(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be a valid number" });
      }
  
      await db.query("UPDATE cart SET quantity = $1 WHERE id = $2", [quantity, id]);
  
      res.json({ message: "Cart updated successfully" });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  
  export const removeCartItem = async (req, res) => {
    const userId = req.user.userId; // Extract user ID from token
    const cartId = req.params.id;
  
    try {
      const result = await db.query(
        "DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *",
        [cartId, userId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Cart item not found" });
      }
  
      res.json({ message: "Item removed from cart successfully" });
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ message: "Server error" });
    }
  };