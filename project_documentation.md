# 📘 ChatSphere: Complete Project Documentation

Welcome to the comprehensive documentation of **ChatSphere**, a real-time, responsive chat application built using the modern MERN (MongoDB, Express, React, Node.js) stack and Socket.IO.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js | Dynamic, stateful UI development |
| **Frontend Style**| Tailwind CSS | Theme transitions, responsive layouts, premium animations |
| **Backend** | Node.js + Express.js | Scalable API server, HTTP routing, and Middleware |
| **Database** | MongoDB + Mongoose | Document-based data modeling, persistent storage |
| **Realtime Engine** | Socket.IO (WebSockets)| Bi-directional, event-based connection for instant chat |
| **Authentication** | JSON Web Tokens (JWT) | Secure, stateless session authorization |

---

## 🏗️ System Architecture

The following diagram illustrates how the Client, Server, Database, and Socket.IO communicate with each other:

```mermaid
graph TD
    %% Define Nodes
    Client["💻 Client (React + Socket.io-client)"]
    Server["⚙️ Server (Express API + Socket.IO Server)"]
    DB[("🗄️ MongoDB Database")]

    %% Communications
    Client -->|1. REST APIs (Axios)| Server
    Client <-->|2. Realtime Events (WebSockets)| Server
    Server -->|3. Read/Write Data| DB
```

---

## 💾 Database Schema (MongoDB Models)

### 1. User Model
Stores registered user credentials, profile information, and activity status.

*   **File Path:** `backend/models/User.js`
*   **Fields:**
    *   `name` (String, Required): Display name.
    *   `email` (String, Required, Unique): User's login email.
    *   `password` (String, Required): Hashed password string.
    *   `timestamps` (Automatic): `createdAt` and `updatedAt` fields.

### 2. Message Model
Stores messages exchanged between any two users.

*   **File Path:** `backend/models/Message.js`
*   **Fields:**
    *   `senderId` (ObjectId referencing `User`): The sender of the message.
    *   `receiverId` (ObjectId referencing `User`): The receiver of the message.
    *   `text` (String, Required): Message text body.
    *   `timestamps` (Automatic): `createdAt` and `updatedAt`.

---

## 🔄 End-to-End Execution Flows

### 1. User Registration & Authentication (JWT Authentication Flow)
*   **Signup:** Client sends a POST request to `/api/auth/register` with `name`, `email`, and `password`. The server hashes the password using `bcryptjs`, saves it in MongoDB, and signs a JWT token containing the user ID.
*   **Login:** Client sends credentials to `/api/auth/login`. Server compares hashed passwords. If they match, it returns a new JWT token.
*   **Header auth:** All protected API requests append the token inside custom headers, which is verified on the server using custom authentication middleware.

### 2. Real-time Connection Handshake & Socket mapping
When the React application loads, it connects to the Socket.IO server:
*   **Handshake:** The client establishes a connection to the backend Socket.IO server.
*   **Online Status:** The server registers active sockets and broadcasts online users' IDs to all clients so green indicator dots show up next to active profiles.

### 3. Clear Chat History Flow
*   Deletes all messages between the current user and the selected contact from the MongoDB database.
*   Triggered by clicking the Trash icon in the chat header, it calls:
    *   `DELETE /api/messages/clear/:userId`
*   The database runs `Message.deleteMany(...)` to clear the conversation. The frontend clears the `messages` state locally to update the UI instantly.

---

## 🌐 API Endpoint Reference

All endpoints are prefixed with the base server URL (e.g., `http://localhost:5000`).

### 🔑 Authentication Routes (`/api/auth`)
| HTTP Method | Route | Middleware | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/register` | None | `{ name, email, password }` | Registers a new account, hashes password, returns JWT |
| **POST** | `/login` | None | `{ email, password }` | Authenticates credentials, returns user profile + token |

### 💬 Messaging Routes (`/api/messages`)
| HTTP Method | Route | Middleware | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/:userId` | `protectRoute` | None (URL Param: Selected user ID) | Fetches chat history between users |
| **POST** | `/send` | `protectRoute` | `{ receiverId, text }` | Sends a message (text) to receiver user |
| **DELETE** | `/clear/:userId` | `protectRoute` | None (URL Param: User ID) | Clears all chat history between current user and selected user |

---

## ⚡ Socket.IO Event Reference

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| **`connection`** | Client ➡️ Server | Handshake Query | Registers client socket and maps socket ID |
| **`getOnlineUsers`**| Server ➡️ Client | Array of active User IDs | Broadcasts current active users online |
| **`send_message`** | Client ➡️ Server | `{ senderId, receiverId, text }` | Emits a new message |
| **`receive_message`**| Server ➡️ Client | Message Document | Relays message to receiver |
| **`disconnect`** | Client ➡️ Server | None | Cleans socket mappings |

---

## 🎓 Quick Viva Revision Checklist

1.  **JWT Verification:** Sent from the frontend under headers, decrypted on the server via `jwt.verify(token, JWT_SECRET)`.
2.  **Cross-Origin Resource Sharing (CORS):** Essential because frontend runs on port `5173` (Vite default) and backend on port `5000`. CORS allows communication between different ports.
3.  **Local Database Configuration:** Connected to MongoDB running locally (`mongodb://localhost:27017`) to prevent server latency or DNS resolution lookup crashes.

---

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
