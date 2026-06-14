// socket/socketHandler.js
const socketHandler = (io) => {
  // Maps userId -> Set of socketIds
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });

    socket.on("send_message", (messageData) => {
      const receiverSockets = onlineUsers.get(messageData.receiverId);
      if (receiverSockets && receiverSockets.size > 0) {
        receiverSockets.forEach((socketId) => {
          io.to(socketId).emit("receive_message", messageData);
        });
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.forEach((socketIds, userId) => {
        if (socketIds.has(socket.id)) {
          socketIds.delete(socket.id);
          if (socketIds.size === 0) {
            onlineUsers.delete(userId);
          }
        }
      });
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = socketHandler;


