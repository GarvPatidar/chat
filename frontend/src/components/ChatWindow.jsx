// components/ChatWindow.jsx
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const ChatWindow = ({ selectedUser }) => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/messages/${selectedUser._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;
    socket.on("receive_message", (newMessage) => {
      if (newMessage.senderId === selectedUser?._id || newMessage.receiverId === selectedUser?._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });
    return () => socket.off("receive_message");
  }, [socket, selectedUser]);

  const handleSendMessage = async (text) => {
    setSending(true);
    try {
      const response = await axiosInstance.post("/messages/send", {
        receiverId: selectedUser._id,
        text,
      });
      const savedMessage = response.data;
      setMessages((prev) => [...prev, savedMessage]);
      socket?.emit("send_message", { ...savedMessage, receiverId: selectedUser._id });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-400">
          <p className="text-5xl mb-4">💬</p>
          <p className="text-lg font-medium">Select a user to start chatting</p>
          <p className="text-sm mt-1">Choose from the sidebar on the left</p>
        </div>
      </div>
    );
  }

  const isSelectedUserOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 bg-white border-b border-slate-200">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-500 text-white">
              {selectedUser.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${isSelectedUserOnline ? "bg-green-500" : "bg-slate-300"}`} />
        </div>
        <div>
          <p className="font-semibold text-slate-800">{selectedUser.name}</p>
          <p className="text-xs text-slate-400">{isSelectedUserOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {loading ? (
          <p className="text-center text-slate-400 text-sm">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-slate-400 text-sm">No messages yet. Say hi! 👋</p>
        ) : (
          messages.map((msg) => <MessageBubble key={msg._id} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={handleSendMessage} loading={sending} />
    </div>
  );
};

export default ChatWindow;
