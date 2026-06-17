// context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (user) {
      // const newSocket = io("http://localhost:5000");
      const newSocket = io("https://chat-wjm2.onrender.com");

      newSocket.on("connect", () => {
        newSocket.emit("user_connected", user._id);
      });

      if (newSocket.connected) {
        newSocket.emit("user_connected", user._id);
      }

      newSocket.on("online_users", (users) => {
        setOnlineUsers(users);
      });

      setSocket(newSocket);


      
      return () => newSocket.disconnect();
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
