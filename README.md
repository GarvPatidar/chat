# 💬 Real-Time Chat Application

A full-stack real-time chat application built with MERN Stack + Socket.IO.

## 🛠️ Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Socket.IO  
**Frontend:** React (Vite), React Router, Axios, Tailwind CSS, ShadCN UI

## 📁 Project Structure

```
chat-app/
├── backend/         # Express + Socket.IO server
└── frontend/        # React + Vite client
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas URI)

### Backend Setup
```bash
cd backend
npm install
# Edit .env file with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_secret_key_here
```

## ✨ Features
- User Registration & Login
- JWT Authentication
- Protected Routes
- Real-Time Messaging (Socket.IO)
- Online/Offline Status
- Message Timestamps
- Responsive Design
- Clear Chat History (Delete conversation)

## 🎨 Shadcn UI Integration

This project uses **Shadcn UI** components inside the frontend to build a highly responsive and clean user interface. Unlike traditional component libraries, Shadcn UI components are installed directly into the project codebase under `frontend/src/components/ui/` and styled using Tailwind CSS classes.

### 🧩 Used Components:
1.  **Avatar (`frontend/src/components/ui/avatar.jsx`):** 
    *   *Where:* Used in the `Sidebar` contact list and `ChatWindow` header.
    *   *How:* Wrapped on top of Radix UI's `@radix-ui/react-avatar` primitive to handle default fallback initials (e.g. "A" for Alison) smoothly if the profile doesn't have an image.
2.  **Button (`frontend/src/components/ui/button.jsx`):**
    *   *Where:* Form submissions in `LoginPage` / `RegisterPage`, and the send button inside `MessageInput`.
    *   *How:* Uses `class-variance-authority` (cva) to create clean, reusable styles (like outline, ghost, primary) with simple React props.
3.  **Card (`frontend/src/components/ui/card.jsx`):**
    *   *Where:* Registration and Login forms container card wrapper.
    *   *How:* Combines native HTML `div`, `h3`, and `p` tags with pre-configured Tailwind layouts for cards.
4.  **Input (`frontend/src/components/ui/input.jsx`):**
    *   *Where:* Form input fields (email, name, password) in Auth pages.
    *   *How:* Standard styles for text inputs with clean focus ring animations.
5.  **Label (`frontend/src/components/ui/label.jsx`):**
    *   *Where:* Labels for all input fields.
    *   *How:* Built on top of Radix UI's `@radix-ui/react-label` primitive for high accessibility.

### ⚙️ How it is configured:
*   **Tailwind Merge & Clsx (`src/lib/utils.js`):** We use a helper function `cn` to merge Tailwind classes dynamically without styling conflicts:
    ```javascript
    import { clsx } from "clsx"
    import { twMerge } from "tailwind-merge"
    
    export function cn(...inputs) {
      return twMerge(clsx(inputs))
    }
    ```
*   **Path Aliasing (`jsconfig.json`):** Path mapping is configured so that components can be cleanly imported using the `@/` prefix (e.g., `import { Avatar } from "@/components/ui/avatar"`).

