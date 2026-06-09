// socket/socketHandler.js
const socketHandler = (io) => {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log(`⚡ Socket Connected: ${socket.id}`);

    socket.on("user_connected", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });

    socket.on("send_message", (messageData) => {
      const receiverSocketId = onlineUsers.get(messageData.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", messageData);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) onlineUsers.delete(userId);
      });
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = socketHandler;
