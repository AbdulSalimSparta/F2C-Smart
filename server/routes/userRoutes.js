import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import db from "../database/db.js";
import multer from "multer";
import path from "path";


const router = express.Router();

// Fetch Current User Data
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [req.user.userId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data", error: error.message });
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await db.query(
      `SELECT u.id, u.username, u.email, u.phonenumber, u.profileimg, u.role,
              a.id as address_id, a.street_address, a.city, a.postal_code, a.phone as address_phone, a.type
       FROM users u
       LEFT JOIN addresses a ON u.id = a.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(result.rows[0]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// UPDATE user details (name, phone)
router.put("/update", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { username, phonenumber } = req.body;

  try {
    await db.query(
      "UPDATE users SET username = $1, phonenumber = $2 WHERE id = $3",
      [username, phonenumber, userId]
    );
    res.json({ message: "User details updated" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// UPDATE or INSERT address
router.put("/address", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { street_address, city, postal_code, phone, type } = req.body;

  try {
    const existing = await db.query("SELECT * FROM addresses WHERE user_id = $1", [userId]);

    if (existing.rows.length > 0) {
      await db.query(
        `UPDATE addresses SET street_address = $1, city = $2, postal_code = $3, phone = $4, type = $5 
         WHERE user_id = $6`,
        [street_address, city, postal_code, phone, type, userId]
      );
    } else {
      await db.query(
        `INSERT INTO addresses (user_id, street_address, city, postal_code, phone, type)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, street_address, city, postal_code, phone, type]
      );
    }

    res.json({ message: "Address saved successfully" });
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ message: "Error saving address" });
  }
});

// UPDATE profile image
router.put("/profileimg", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { profileimg } = req.body;

  try {
    await db.query("UPDATE users SET profileimg = $1 WHERE id = $2", [profileimg, userId]);
    res.json({ message: "Profile image updated" });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Failed to update image" });
  }
});

// Apply to become a seller by changing role (optional feature)
router.post("/apply-seller", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    await db.query("UPDATE users SET role = 'pending_seller' WHERE id = $1", [userId]);
    res.json({ message: "Seller request submitted" });
  } catch (error) {
    console.error("Error applying for seller:", error);
    res.status(500).json({ message: "Error applying for seller access" });
  }
});




export default router;
