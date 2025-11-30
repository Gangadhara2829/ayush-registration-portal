const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Startup = require('../models/Startup');
const Admin = require('../models/Admin');
const upload = require('../config/upload');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ---------- GOOGLE LOGIN ENDPOINT ----------
router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    // 1. Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email } = ticket.getPayload();

    // 2. Check email in Admin or Startup
    let user = await Admin.findOne({ email });
    let role = 'official';

    if (!user) {
      user = await Startup.findOne({ email });
      role = 'startup';
    }

    if (!user) {
      return res.status(400).json({
        msg: 'Account not found. Please register as a startup first to upload required documents.'
      });
    }

    // 3. Generate JWT
    const payload = {
      user: {
        id: user.id,
        role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).send('Google Login Server Error');
  }
});

// ---------- STANDARD LOGIN ----------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Admin.findOne({ email });
    let role = 'official';

    if (!user) {
      user = await Startup.findOne({ email });
      role = 'startup';
    }

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    const payload = {
      user: {
        id: user.id,
        role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ---------- STARTUP REGISTRATION ----------
router.post('/register', (req, res) => {
  upload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'founderId', maxCount: 1 },
    { name: 'complianceDocs', maxCount: 5 }
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }

    const {
      startupName,
      sector,
      founderName,
      contactNumber,
      email,
      password,
      location
    } = req.body;

    if (!email || !password || !startupName) {
      return res.status(400).json({ msg: 'Please enter all required fields.' });
    }

    try {
      let startup = await Startup.findOne({ email });
      if (startup) {
        return res.status(400).json({ msg: 'A startup with this email already exists.' });
      }

      startup = new Startup({
        startupName,
        sector,
        founderName,
        contactNumber,
        email,
        password,
        location,
        documents: {
          registrationCertificate: req.files.registrationCertificate
            ? req.files.registrationCertificate[0].path
            : '',
          founderId: req.files.founderId
            ? req.files.founderId[0].path
            : '',
          complianceDocs: req.files.complianceDocs
            ? req.files.complianceDocs.map(file => file.path)
            : []
        }
      });

      await startup.save();

      const payload = {
        user: {
          id: startup.id,
          role: 'startup'
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
});

// ---------- ADMIN REGISTRATION ----------
router.post('/admin/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ msg: 'Admin already exists.' });
    }

    admin = new Admin({ email, password });
    await admin.save();

    res.status(201).send('Admin user created successfully.');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
