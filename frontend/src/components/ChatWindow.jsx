// components/ChatWindow.jsx
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

const ChatWindow = ({ selectedUser, messages = [], setMessages, loading = false }) => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [sending, setSending] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageData) => {
    setSending(true);
    try {
      const response = await axiosInstance.post("/messages/send", {
        receiverId: selectedUser._id,
        text: messageData.text,
        image: messageData.image,
      });
      const savedMessage = response.data;
      setMessages((prev) => [...prev, savedMessage]);
      socket?.emit("send_message", { ...savedMessage, receiverId: selectedUser._id });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear this chat history?")) return;
    try {
      await axiosInstance.delete(`/messages/clear/${selectedUser._id}`);
      setMessages([]);
    } catch (error) {
      console.error("Error clearing chat:", error);
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
            {selectedUser.profilePic && <AvatarImage src={selectedUser.profilePic} alt={selectedUser.name} />}
            <AvatarFallback className="bg-blue-500 text-white font-semibold">
              {selectedUser.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${isSelectedUserOnline ? "bg-green-500" : "bg-slate-300"}`} />
        </div>
        <div>
          <p className="font-semibold text-slate-800">{selectedUser.name}</p>
          <p className="text-xs text-slate-400">{isSelectedUserOnline ? "Online" : "Offline"}</p>
        </div>
        <button 
          onClick={handleClearChat}
          className="ml-auto p-2 text-slate-400 hover:text-rose-500 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
          title="Clear Chat"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {loading ? (
          <p className="text-center text-slate-400 text-sm">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-slate-400 text-sm">No messages yet. Say hi! 👋</p>
        ) : (
          messages.map((msg) => (
            <MessageBubble 
              key={msg._id} 
              message={msg} 
              onImageClick={setPreviewImage} 
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={handleSendMessage} loading={sending} />

      {/* Larger Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-transparent rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <img 
              src={previewImage} 
              alt="Larger preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-md" 
            />
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
