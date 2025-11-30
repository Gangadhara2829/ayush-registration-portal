const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  // The ID of the startup this chat belongs to
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true,
    index: true // Add an index for faster message retrieval
  },
  // Who sent the message
  sender: {
    type: String,
    required: true,
    enum: ['startup', 'official'] // Only allow these two values
  },
  // The content of the message
  content: {
    type: String,
    required: true,
    trim: true
  }
}, {
  // Automatically add createdAt and updatedAt fields
  timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);