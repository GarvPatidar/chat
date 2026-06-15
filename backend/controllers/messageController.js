const Message = require("../models/Message");
const cloudinary = require("../config/cloudinary");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, image } = req.body;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({ message: "Please provide a receiver ID" });
    }

    if (!text && !image) {
      return res.status(400).json({ message: "Please provide either text or an image message" });
    }

    let imageUrl = "";
    if (image) {
      const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                           process.env.CLOUDINARY_CLOUD_NAME !== "your_cloudinary_cloud_name" &&
                           process.env.CLOUDINARY_API_KEY && 
                           process.env.CLOUDINARY_API_SECRET;

      if (hasCloudinary) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "chat_messages",
          });
          imageUrl = uploadResponse.secure_url;
        } catch (uploadError) {
          console.warn("Cloudinary message image upload failed, falling back to base64:", uploadError.message);
          imageUrl = image;
        }
      } else {
        console.log("Cloudinary not configured or placeholder. Storing message image as base64 in DB.");
        imageUrl = image;
      }
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
    });

    // Emit the message via socket immediately after storing in MongoDB
    try {
      const { getReceiverSocketIds, getIO } = require("../socket/socketHandler");
      const io = getIO();
      if (io) {
        const receiverSockets = getReceiverSocketIds(receiverId.toString());
        if (receiverSockets && receiverSockets.size > 0) {
          receiverSockets.forEach((socketId) => {
            io.to(socketId).emit("receive_message", newMessage);
          });
        }
      }
    } catch (socketError) {
      console.error("Error emitting socket message from backend:", socketError);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
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
