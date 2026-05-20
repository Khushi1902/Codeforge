const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalCode: {
    type: String,
    required: true,
  },
  fixedCode: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  techStack: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'javascript',
  },
  action: {
    type: String,
    enum: ['fix', 'explain', 'optimize'],
    default: 'fix',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('History', historySchema);
