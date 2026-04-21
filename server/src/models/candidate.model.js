const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  analysis: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Analysis' // קישור לטבלת הניתוח שרותי תמלא
  }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', CandidateSchema);