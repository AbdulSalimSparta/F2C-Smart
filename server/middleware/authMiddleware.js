import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET__KEY;

// export const authenticateToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized: No token provided" });
//   }

//   jwt.verify(token, SECRET_KEY, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: "Forbidden: Invalid token" });
//     }
//     req.user = user;
//     next();
//   });
// };

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader); // ✅ Debug

  const token = authHeader && authHeader.split(" ")[1];
  console.log("Extracted Token:", token); // ✅ Debug extracted token

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err); // ✅ Log decoding issues
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    
    console.log("Decoded User:", user); // ✅ Debug user data
    req.user = user; // Attach user info to request
    next();
  });
};
