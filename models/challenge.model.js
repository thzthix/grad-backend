const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  exercise: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly'] // 도전 과제 타입 필드 추가
},
  targetCount: {
    type: Number,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date
});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
