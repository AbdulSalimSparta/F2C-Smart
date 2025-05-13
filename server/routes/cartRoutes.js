import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js"; // Auth middleware
import { addToCart, getCartItems,updateCartQuantity,removeCartItem } from "../controllers/cartController.js";
const router = express.Router();

// ✅ Route to add product to cart
router.post("/add", authenticateToken, addToCart);
router.get("/items", authenticateToken, getCartItems);
router.put("/update/:id", authenticateToken, updateCartQuantity);
// ✅ Remove item
router.delete("/delete/:id", authenticateToken, removeCartItem);

export default router;
