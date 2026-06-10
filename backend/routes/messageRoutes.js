// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const { sendMessage, getMessages, clearChat } = require("../controllers/messageController");
const { protectRoute } = require("../middleware/authMiddleware");

router.post("/send", protectRoute, sendMessage);
router.get("/:userId", protectRoute, getMessages);
router.delete("/clear/:userId", protectRoute, clearChat);

module.exports = router;
