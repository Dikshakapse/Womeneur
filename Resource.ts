import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: {
    type: String,
    enum: ['guide', 'template', 'tool', 'article', 'video'],
  },
  url: String,
  category: [String],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export const Resource = mongoose.model('Resource', resourceSchema);
