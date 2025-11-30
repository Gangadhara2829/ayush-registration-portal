const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// @route   GET api/messages/:startupId
// @desc    Get all messages for a specific startup
// @access  Private (for the specific startup and all officials)
router.get('/:startupId', auth, async (req, res) => {
  try {
    const startupId = req.params.startupId;

    // --- Authorization Check ---
    // If the user is a startup, they can only get their own messages.
    if (req.user.role === 'startup' && req.user.id !== startupId) {
      return res.status(403).json({ msg: 'Access denied.' });
    }
    // If the user is an official, they are allowed.

    const messages = await Message.find({ startupId }).sort({ createdAt: 1 });
    res.json(messages);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;