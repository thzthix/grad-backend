const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChallengeSchema = new Schema({
  type: { type: String, required: true }, // 'specific', 'weeklyFrequency', 'dailyVariety', 'weeklyVariety', 'consecutiveDays'
  target: { type: Number, required: true },
  description: { type: String, required: true },
  progress: { type: Number, default: 0 }, // 도전 과제의 진행도
});

const Challenge = mongoose.model('Challenge', ChallengeSchema);
module.exports = Challenge;
