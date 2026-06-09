// components/MessageInput.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MessageInput = ({ onSendMessage, loading }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 bg-white border-t border-slate-200">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        disabled={loading}
        className="flex-1"
        autoComplete="off"
      />
      <Button type="submit" disabled={!text.trim() || loading} className="px-6">
        Send
      </Button>
    </form>
  );
};

export default MessageInput;
