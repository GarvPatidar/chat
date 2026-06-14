// pages/ChatPage.jsx
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useSocket } from "../context/SocketContext";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const { socket } = useSocket();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/auth/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }

    // Clear unread count for this user
    setUnreadCounts((prev) => ({
      ...prev,
      [selectedUser._id]: 0,
    }));

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const response = await axiosInstance.get(`/messages/${selectedUser._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMessage) => {
      const isFromSelected = selectedUser && newMessage.senderId === selectedUser._id;
      const isToSelected = selectedUser && newMessage.receiverId === selectedUser._id;

      if (isFromSelected || isToSelected) {
        setMessages((prev) => [...prev, newMessage]);
      } else {
        // Find sender's name
        const sender = users.find((u) => u._id === newMessage.senderId);
        const senderName = sender ? sender.name : "Someone";

        // Increment unread count
        setUnreadCounts((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));

        // Show toast notification
        toast(`📩 ${senderName}: "${newMessage.text || "Sent an image"}"`, {
          icon: "💬",
          duration: 4000,
        });
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, selectedUser, users]);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        users={users}
        loading={loadingUsers}
        unreadCounts={unreadCounts}
      />
      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        setMessages={setMessages}
        loading={loadingMessages}
      />
    </div>
  );
};

export default ChatPage;

