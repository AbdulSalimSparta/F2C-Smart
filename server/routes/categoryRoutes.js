import express from "express";
import db from "../database/db.js";  // Ensure this path is correct

const router = express.Router();

// ✅ GET all categories
router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM categories");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ GET products by category ID with filters
router.get("/:categoryId/products", async (req, res) => {
    const { categoryId } = req.params;
    const search = req.query.search || "";
    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || 99999;

    try {
        const query = `
            SELECT p.*, u.username AS seller_name, c.name AS category_name
            FROM products p
            JOIN users u ON p.seller_id = u.id
            JOIN categories c ON p.category_id = c.id
            WHERE p.category_id = $1 
              AND p.name ILIKE $2 
              AND p.price BETWEEN $3 AND $4
              AND approved IS true
        `;
        console.log("Executing SQL Query:", query);  // Debugging

        const result = await db.query(query, [categoryId, `%${search}%`, minPrice, maxPrice]);
        
        console.log("Query Result:", result.rows);  // Debugging

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
