// socket/socketHandler.js
const onlineUsers = new Map();
let ioInstance = null;

const socketHandler = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });

    // Keeping send_message handler for backward compatibility if needed
    socket.on("send_message", (messageData) => {
      const receiverSockets = onlineUsers.get(messageData.receiverId);
      if (receiverSockets && receiverSockets.size > 0) {
        receiverSockets.forEach((socketId) => {
          io.to(socketId).emit("receive_message", messageData);
        });
      }
    });

    // WebRTC call events
    socket.on("call_user", ({ userToCall, signalData, from, name, callType }) => {
      const receiverSockets = onlineUsers.get(userToCall);
      if (receiverSockets && receiverSockets.size > 0) {
        receiverSockets.forEach((socketId) => {
          io.to(socketId).emit("call_user", { signal: signalData, from, name, callType });
        });
      }
    });

    socket.on("answer_call", ({ to, signal }) => {
      const callerSockets = onlineUsers.get(to);
      if (callerSockets && callerSockets.size > 0) {
        callerSockets.forEach((socketId) => {
          io.to(socketId).emit("answer_call", { signal });
        });
      }
    });

    socket.on("ice_candidate", ({ to, candidate }) => {
      const targetSockets = onlineUsers.get(to);
      if (targetSockets && targetSockets.size > 0) {
        targetSockets.forEach((socketId) => {
          io.to(socketId).emit("ice_candidate", { candidate });
        });
      }
    });

    socket.on("end_call", ({ to }) => {
      const targetSockets = onlineUsers.get(to);
      if (targetSockets && targetSockets.size > 0) {
        targetSockets.forEach((socketId) => {
          io.to(socketId).emit("end_call");
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

const getReceiverSocketIds = (receiverId) => {
  return onlineUsers.get(receiverId);
};

const getIO = () => {
  return ioInstance;
};

module.exports = {
  socketHandler,
  getReceiverSocketIds,
  getIO,
};


