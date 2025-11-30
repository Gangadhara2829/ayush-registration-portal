const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Startup = require('../models/Startup');
const Admin = require('../models/Admin');

// ---------------------------------------------------
// @route   GET /api/dashboard/me
// @desc    Get logged-in user info (startup/admin)
// @access  Private
// ---------------------------------------------------
router.get('/me', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('Authentication error: req.user is not set by auth middleware.');
      return res.status(401).json({ msg: 'Authentication error, user not found in token.' });
    }

    let doc = null;

    if (req.user.role === 'startup') {
      doc = await Startup.findById(req.user.id).select('-password');
    } else if (req.user.role === 'official') {
      doc = await Admin.findById(req.user.id).select('-password');
    }

    if (!doc) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const user = doc.toObject();
    user.role = req.user.role;

    res.json(user);
  } catch (err) {
    console.error('Error in /api/dashboard/me:', err.message);
    res.status(500).send('Server Error');
  }
});

// ---------------------------------------------------
// @route   GET /api/dashboard/my-application
// @desc    Get the logged-in startup's application data
// @access  Private (Startup only)
// ---------------------------------------------------
router.get('/my-application', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('Authentication error: req.user is not set by auth middleware.');
      return res.status(401).json({ msg: 'Authentication error, user not found in token.' });
    }

    if (req.user.role !== 'startup') {
      return res.status(403).json({ msg: 'Access denied. Not a startup.' });
    }

    const startup = await Startup.findById(req.user.id).select('-password');

    if (!startup) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    res.json(startup);
  } catch (err) {
    console.error('Error in /api/dashboard/my-application:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
