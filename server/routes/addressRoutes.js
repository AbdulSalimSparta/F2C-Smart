import express from "express";
import db from "../database/db.js"; // Ensure this is correct

const router = express.Router();

// Save Address
router.post("/address", async (req, res) => {
    const { user_id, street_address, city, postal_code, phone, type } = req.body;

    if (!user_id || !street_address || !city || !postal_code || !phone || !type) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newAddress = await db.query(
            "INSERT INTO addresses (user_id, street_address, city, postal_code, phone, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [user_id, street_address, city, postal_code, phone, type]
        );

        res.status(201).json(newAddress.rows[0]);
    } catch (err) {
        console.error("Error inserting address:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get User's Addresses
router.get("/address/:user_id", async (req, res) => {
    try {
        const addresses = await db.query(
            "SELECT * FROM addresses WHERE user_id = $1",
            [req.params.user_id]
        );

        if (addresses.rows.length === 0) {
            return res.status(404).json({ error: "No addresses found" });
        }

        res.json(addresses.rows);
    } catch (err) {
        console.error("Error fetching addresses:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
