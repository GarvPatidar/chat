import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = ({ onSendMessage, loading }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const fileInputRef = useRef(null);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image (JPG, JPEG, PNG, WEBP)");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;
    onSendMessage({ text: text.trim(), image });
    setText("");
    setImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
  };

  return (
    <div className="flex flex-col border-t border-slate-200 bg-white">
      {image && (
        <div className="flex items-center gap-3 p-3 px-4 bg-slate-50 border-b border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="relative h-14 w-14 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <img src={image} alt="Preview" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => setImage("")}
              className="absolute top-0.5 right-0.5 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
              title="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <p className="text-xs text-slate-400 font-medium">Image attached. Press Send to upload.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleAttachClick}
          disabled={loading}
          className="text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
          title="Attach Image"
        >
          <Image className="h-5 w-5" />
        </Button>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={image ? "Add a caption (optional)..." : "Type a message..."}
          disabled={loading}
          className="flex-1"
          autoComplete="off"
        />
        <Button 
          type="submit" 
          disabled={(!text.trim() && !image) || loading} 
          className="px-6 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
