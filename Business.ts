import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  description: String,
  industry: String,
  stage: {
    type: String,
    enum: ['ideation', 'planning', 'startup', 'growth', 'scaling'],
    default: 'ideation'
  },
  financials: {
    initialInvestment: Number,
    projectedRevenue: Number,
    monthlyExpenses: Number
  },
  documents: [{
    title: String,
    type: String,
    url: String,
    uploadedAt: Date
  }],
  progress: {
    milestonesCompleted: Number,
    currentGoals: [String],
    nextSteps: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

export const Business = mongoose.model('Business', businessSchema);
