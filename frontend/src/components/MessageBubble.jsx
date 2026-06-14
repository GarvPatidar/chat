// components/MessageBubble.jsx
import { useAuth } from "../context/AuthContext";

const MessageBubble = ({ message, onImageClick }) => {
  const { user } = useAuth();
  const isMyMessage = message.senderId === user._id;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`max-w-xs lg:max-w-md rounded-2xl overflow-hidden ${
        isMyMessage
          ? "bg-blue-500 text-white rounded-br-sm"
          : "bg-white text-slate-800 rounded-bl-sm shadow-sm"
      }`}>
        {message.image && (
          <div className="relative group cursor-pointer overflow-hidden border-b border-slate-100/10">
            <img 
              src={message.image} 
              alt="Sent image" 
              className="max-w-full max-h-60 object-cover hover:scale-[1.02] transition-transform duration-200"
              onClick={() => onImageClick?.(message.image)}
            />
          </div>
        )}
        {(message.text || !message.image) && (
          <div className="px-4 pt-2 pb-1">
            <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
          </div>
        )}
        <div className="px-4 pb-2 pt-0.5 flex justify-end">
          <p className={`text-[10px] ${isMyMessage ? "text-blue-100" : "text-slate-400"}`}>
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
