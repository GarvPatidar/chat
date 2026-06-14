// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getAllUsers, getMe, updateProfile } = require("../controllers/authController");
const { protectRoute } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protectRoute, getAllUsers);
router.get("/me", protectRoute, getMe);
router.put("/profile/update", protectRoute, updateProfile);

module.exports = router;
