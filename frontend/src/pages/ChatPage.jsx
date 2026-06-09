// pages/ChatPage.jsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar selectedUser={selectedUser} onSelectUser={setSelectedUser} />
      <ChatWindow selectedUser={selectedUser} />
    </div>
  );
};

export default ChatPage;
