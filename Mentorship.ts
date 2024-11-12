import mongoose from 'mongoose';

const mentorshipSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  goals: [String],
  meetingSchedule: String,
  notes: [{
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  startDate: Date,
  endDate: Date
});

export const Mentorship = mongoose.model('Mentorship', mentorshipSchema);