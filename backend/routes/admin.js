const express = require('express');
const router = express.Router();
const Startup = require('../models/Startup');
const auth = require('../middleware/auth');

// Middleware to check if the user is an official
const adminAuth = (req, res, next) => {
    if (req.user && req.user.role === 'official') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Not an official.' });
    }
};

// Get all applications
router.get('/applications', [auth, adminAuth], async (req, res) => {
  try {
    const applications = await Startup.find().select('-password').sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- UPDATED STATUS UPDATE ROUTE ---
router.put('/update-status/:startupId', [auth, adminAuth], async (req, res) => {
  const { newStatus, comment } = req.body;

  if (!newStatus) {
    return res.status(400).json({ msg: 'New status is required.' });
  }

  try {
    const startup = await Startup.findById(req.params.startupId);
    if (!startup) {
      return res.status(404).json({ msg: 'Startup application not found' });
    }

    // 1. Update status
    startup.applicationStatus = newStatus;

    // --- SAFETY CHECK (Fixes the crash) ---
    // If this startup record is old and doesn't have the timeline array, create it now.
    if (!Array.isArray(startup.statusTimeline)) {
      startup.statusTimeline = [];
    }
    // --------------------------------------

    // 2. Add to history
    startup.statusTimeline.push({
      status: newStatus,
      comment: comment || ''
    });

    // 3. Save
    await startup.save();

    // 4. Real-time update
    const io = req.app.get('socketio');
    io.to(req.params.startupId).emit('statusUpdate', {
      applicationStatus: startup.applicationStatus,
      statusTimeline: startup.statusTimeline
    }); 

    res.json(startup);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;