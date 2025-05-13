const express = require("express");
const router = express.Router();
const pool = require("../database/db"); // Assuming you're using PostgreSQL

// Add a review for a product
router.post("/:id/reviews", async (req, res) => {
  const { id } = req.params; // Product ID
  const { userId, rating, comment } = req.body; // Review data

  try {
    const result = await pool.query(
      "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, userId, rating, comment]
    );

    res.status(201).json({ success: true, review: result.rows[0] });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
