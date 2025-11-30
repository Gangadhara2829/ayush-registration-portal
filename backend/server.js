// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const Message = require('./models/Message');
const { getAiResponse } = require('./aiLogic');

const app = express();
const server = http.createServer(app);

// ---------------- CORS ORIGINS ----------------
const CLIENT_ORIGINS = [
  'http://localhost:3000',                               // local dev
  'https://ayush-registration-portal.vercel.app',       // main Vercel URL
  'https://ayush-registration-portal-ju7n.vercel.app',  // preview / alt URL
].filter(Boolean);

// ------------- Express middleware -------------
app.use(
  cors({
    origin: CLIENT_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
  })
);

app.use(express.json());

// Handle preflight explicitly (helps some browsers)
app.options('*', cors());

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple health check route
app.get('/', (req, res) => {
  res.send('AYUSH portal backend is running ✅');
});

// ------------- MongoDB Connection -------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ----------------- API Routes -----------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/messages', require('./routes/messages'));

// ----------------- Socket.IO ------------------
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
  },
});

app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('🔌 WebSocket connected:', socket.id);

  // Join room for admin/startup chat
  socket.on('joinRoom', (startupId) => {
    socket.join(startupId);
    console.log(`User ${socket.id} joined room ${startupId}`);
  });

  // Admin <-> Startup chat messages
  socket.on('sendMessage', async (data, callback) => {
    const { startupId, sender, content } = data;

    if (!startupId || !sender || !content) {
      if (callback) callback({ error: 'Missing data' });
      return;
    }

    try {
      const message = new Message({ startupId, sender, content });
      await message.save();
      io.to(startupId).emit('newMessage', message);
      if (callback) callback({ success: true, message });
    } catch (err) {
      console.error('Error saving message:', err);
      if (callback) callback({ error: 'Server error saving message' });
    }
  });

  // AI helper bot (now offline/logic-only, no Gemini required)
  socket.on('sendToBot', async (messageContent) => {
    console.log(`AI Message Received from ${socket.id}:`, messageContent);

    try {
      const aiResponse = await getAiResponse(messageContent);
      socket.emit('botMessage', {
        sender: 'ai',
        content: aiResponse,
      });
    } catch (err) {
      console.error('AI bot error:', err);
      socket.emit('botMessage', {
        sender: 'ai',
        content:
          "I'm having trouble answering right now. Please try again later.",
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ WebSocket disconnected:', socket.id);
  });
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
