// controllers/messageController.js
const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user._id;
    if (!receiverId || !text)
      return res.status(400).json({ message: "Please provide receiver and message" });
    const newMessage = await Message.create({ senderId, receiverId, text });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

const clearChat = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const myId = req.user._id;
    await Message.deleteMany({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId },
      ],
    });
    res.status(200).json({ message: "Chat cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

module.exports = { sendMessage, getMessages, clearChat };
