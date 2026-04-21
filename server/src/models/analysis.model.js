const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  candidateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Candidate', 
    required: true 
  },
  answers: {
    type: [String],
    default: []
  },
  // נתונים טכניים
  technical: {
    location: { type: Number, default: 0 },
    availability: { type: Number, default: 0 },
    hasRelativeInCompany: { type: Number, default: 0 }
  },
  // ציוני יכולות
  scores: {
    motivation: { type: Number, default: 0 },
    verbalAbility: { type: Number, default: 0 },
    peopleSkills: { type: Number, default: 0 },
    salesOrientation: { type: Number, default: 0 },
    targetOrientation: { type: Number, default: 0 }
  },
  experienceLevel: { type: Number, default: 0 },
  recommendedRole: { type: Number, default: 0 },
  finalScore: { 
    type: Number, 
    default: null 
  },
  summary: { type: String, default: "" },
  insights: [String], // מערך של תובנות
  recommendedQuestions: [String] // שאלות המשך לראיון
}, { timestamps: true });

module.exports = mongoose.model('Analysis', AnalysisSchema);