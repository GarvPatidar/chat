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
