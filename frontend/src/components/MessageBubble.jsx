// components/MessageBubble.jsx
import { useAuth } from "../context/AuthContext";

const MessageBubble = ({ message }) => {
  const { user } = useAuth();
  const isMyMessage = message.senderId === user._id;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isMyMessage
          ? "bg-blue-500 text-white rounded-br-sm"
          : "bg-white text-slate-800 rounded-bl-sm shadow-sm"
      }`}>
        <p className="text-sm">{message.text}</p>
        <p className={`text-xs mt-1 ${isMyMessage ? "text-blue-100" : "text-slate-400"}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
