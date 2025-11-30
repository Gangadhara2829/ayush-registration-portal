const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema for individual timeline events
const StatusEventSchema = new mongoose.Schema({
  status: { 
    type: String, 
    required: true 
  },
  comment: { 
    type: String 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

const StartupSchema = new mongoose.Schema({
  startupName: { type: String, required: true },
  sector: { type: String, required: true },
  founderName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  documents: {
    registrationCertificate: { type: String },
    founderId: { type: String },
    complianceDocs: [{ type: String }],
  },
  
  // --- UPDATED STATUS FIELDS ---
  applicationStatus: {
    type: String,
    enum: ['Submitted', 'Verified', 'Accepted', 'Approved', 'Rejected'], 
    default: 'Submitted'
  },
  statusTimeline: {
    type: [StatusEventSchema],
    default: [] // Initialize as empty array by default
  }
  // --- END OF UPDATED FIELDS ---

}, { timestamps: true });

// Hash password before saving
StartupSchema.pre('save', async function (next) {
  // Add initial status only for truly new documents
  if (this.isNew) {
    // Ensure the array exists before pushing
    if (!this.statusTimeline) {
      this.statusTimeline = [];
    }
    if (this.statusTimeline.length === 0) {
      this.statusTimeline.push({ status: 'Submitted', comment: 'Application received.' });
    }
  }
  
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Startup', StartupSchema);