// ----------------------------
// AYUSH PORTAL BACKEND SERVER
// ----------------------------

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const Message = require('./models/Message');
const { getAiResponse } = require('./aiLogic');

const app = express();
const server = http.createServer(app);

// ----------------------------------------------
// ✅ FINAL SINGLE CORS ORIGINS (USE ONLY THIS)
// ----------------------------------------------
const allowedOrigins = [
  "http://localhost:3000",
  "https://ayush-registration-portal.vercel.app",       // Production Frontend
  "https://ayush-registration-portal-ju7n.vercel.app"   // Preview Frontend
];

// ----------------------------------------------
// ✅ EXPRESS CORS CONFIG
// ----------------------------------------------
const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true); // allow mobile apps / Postman etc.

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS blocked: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight

app.use(express.json());

// ----------------------------------------------
// Serve static files (uploads folder)
// ----------------------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ----------------------------------------------
// MongoDB Connection
// ----------------------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✔ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ----------------------------------------------
// API Routes
// ----------------------------------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/messages', require('./routes/messages'));

// ----------------------------------------------
// SOCKET.IO with CORS
// ----------------------------------------------
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("🔌 WebSocket connected:", socket.id);

  // join startup-specific chat room
  socket.on("joinRoom", (startupId) => {
    socket.join(startupId);
    console.log(`User ${socket.id} joined room ${startupId}`);
  });

  // Startup ↔ Admin Chat
  socket.on("sendMessage", async (data, callback) => {
    const { startupId, sender, content } = data;

    if (!startupId || !sender || !content) {
      if (callback) callback({ error: "Missing required fields" });
      return;
    }

    try {
      const message = new Message({ startupId, sender, content });
      await message.save();

      io.to(startupId).emit("newMessage", message); // broadcast

      if (callback) callback({ success: true, message });

    } catch (err) {
      console.error("Error saving message:", err);
      if (callback) callback({ error: "Server error saving message" });
    }
  });

  // AI bot chat
  socket.on("sendToBot", async (messageContent) => {
    console.log("AI Message Received:", messageContent);

    const aiResponse = await getAiResponse(messageContent);

    setTimeout(() => {
      socket.emit("botMessage", {
        sender: "ai",
        content: aiResponse
      });
    }, 1000);
  });

  socket.on("disconnect", () => {
    console.log("❌ WebSocket disconnected:", socket.id);
  });
});

// ----------------------------------------------
// Start Server
// ----------------------------------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
