// components/Sidebar.jsx
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import axiosInstance from "../api/axios";
import ProfileModal from "./ProfileModal";

const Sidebar = ({ selectedUser, onSelectUser, users = [], loading = false, unreadCounts = {} }) => {
  const { user, logout } = useAuth();
  const { onlineUsers } = useSocket();
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  return (
    <div className="w-72 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">💬 ChatApp</h1>
          <p className="text-xs text-slate-500 mt-1">Hey, {user?.name}!</p>
        </div>
        <button
          onClick={() => setIsProfileOpen(true)}
          className="relative h-10 w-10 rounded-full hover:opacity-80 transition-opacity focus:outline-none ring-2 ring-slate-100 shadow-sm"
          title="Profile Settings"
        >
          <Avatar className="h-10 w-10">
            {user?.profilePic && <AvatarImage src={user.profilePic} alt={user.name} />}
            <AvatarFallback className="bg-blue-600 text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <p className="text-xs font-semibold text-slate-400 uppercase px-2 mb-2">All Users</p>
        {loading ? (
          <p className="text-sm text-slate-400 px-2">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-slate-400 px-2">No users found</p>
        ) : (
          users.map((u) => {
            const isOnline = onlineUsers.includes(u._id);
            const isSelected = selectedUser?._id === u._id;
            const unreadCount = unreadCounts[u._id] || 0;
            return (
              <div
                key={u._id}
                onClick={() => onSelectUser(u)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  isSelected ? "bg-slate-100" : "hover:bg-slate-50"
                }`}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    {u.profilePic && <AvatarImage src={u.profilePic} alt={u.name} />}
                    <AvatarFallback className="bg-blue-500 text-white">
                      {u.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${isOnline ? "bg-green-500" : "bg-slate-300"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{u.name}</p>
                  <p className="text-xs text-slate-400">{isOnline ? "Online" : "Offline"}</p>
                </div>
                {unreadCount > 0 && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm animate-in scale-in duration-200">
                    {unreadCount}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-slate-200">
        <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={logout}>
          Logout
        </Button>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

export default Sidebar;
