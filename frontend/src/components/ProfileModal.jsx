// components/ProfileModal.jsx
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";
import { Camera, X, Loader2 } from "lucide-react";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image (JPG, JPEG, PNG, WEBP)");
      return;
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadstart = () => setUploading(true);
    reader.onloadend = async () => {
      const base64String = reader.result;
      try {
        const response = await axiosInstance.put("/auth/profile/update", {
          profilePic: base64String,
        });

        updateUser(response.data.user);
        toast.success("Profile picture updated successfully!");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        toast.error(error.response?.data?.message || "Failed to update profile picture");
      } finally {
        setUploading(false);
      }
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">My Profile</h2>
            <p className="text-xs text-slate-500">Manage your profile details</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          
          {/* Avatar Section */}
          <div className="relative group cursor-pointer mb-6" onClick={handleImageClick}>
            <Avatar className="h-28 w-28 border-4 border-white shadow-md ring-2 ring-slate-100">
              {user?.profilePic && <AvatarImage src={user.profilePic} alt={user.name} />}
              <AvatarFallback className="bg-blue-600 text-white text-3xl font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera className="h-6 w-6 mb-1" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Change</span>
            </div>

            {/* Spinner when uploading */}
            {uploading && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              </div>
            )}
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden" 
          />

          <p className="text-[11px] text-slate-400 text-center -mt-3 mb-6">
            {uploading ? "Uploading to Cloudinary..." : "Click image to update profile photo"}
          </p>

          {/* Details Form */}
          <div className="w-full space-y-4">
            <div className="space-y-1">
              <Label className="text-xs text-slate-400 font-semibold uppercase">Full Name</Label>
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium">
                {user?.name}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-400 font-semibold uppercase">Email Address</Label>
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium">
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <Button onClick={onClose} variant="outline" className="px-4">
            Close
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ProfileModal;
