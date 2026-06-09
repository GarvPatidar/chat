// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "No token. Access denied." });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user)
      return res.status(401).json({ message: "User not found. Access denied." });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token. Access denied." });
  }
};

module.exports = { protectRoute };
