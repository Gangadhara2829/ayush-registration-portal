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

// ---------------- CORS ORIGINS ----------------
const CLIENT_ORIGINS = [
  "http://localhost:3000",   // React dev server
  // add other origins if needed, e.g. deployed frontend
];

// ------------- Express middleware -------------
app.use(cors({
  origin: CLIENT_ORIGINS,
  credentials: true
}));

app.use(express.json());

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------- MongoDB Connection -------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// ----------------- API Routes -----------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/messages', require('./routes/messages'));

// ----------------- Socket.IO ------------------
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGINS,
    methods: ["GET", "POST", "PUT"]
  }
});

app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);

  socket.on('joinRoom', (startupId) => {
    socket.join(startupId);
    console.log(`User ${socket.id} joined room ${startupId}`);
  });

  // Admin/Startup chat
  socket.on('sendMessage', async (data, callback) => {
    const { startupId, sender, content } = data;
    if (!startupId || !sender || !content) {
      if (callback) callback({ error: "Missing data" });
      return;
    }
    
    try {
      const message = new Message({ startupId, sender, content });
      await message.save();
      io.to(startupId).emit('newMessage', message);
      if (callback) callback({ success: true, message }); 
    } catch (err) {
      console.error('Error saving message:', err);
      if (callback) callback({ error: "Server error saving message" });
    }
  });

  // Gemini AI bot handler
  socket.on('sendToBot', async (messageContent) => {
    console.log(`Message to AI bot from ${socket.id}: ${messageContent}`);

    const aiResponse = await getAiResponse(messageContent);

    setTimeout(() => {
      socket.emit('botMessage', {
        sender: 'ai',
        content: aiResponse
      });
    }, 1000);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
