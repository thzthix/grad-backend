const mongoose = require('mongoose');

const exerciseGoalSchema = new mongoose.Schema({
  pushup: { goal: Number, progress: { type: Number, default: 0 }, isCompleted: { type: Boolean, default: false } },
  squat: { goal: Number, progress: { type: Number, default: 0 }, isCompleted: { type: Boolean, default: false } },
  lunge: { goal: Number, progress: { type: Number, default: 0 }, isCompleted: { type: Boolean, default: false } },
  sidelunge: { goal: Number, progress: { type: Number, default: 0 }, isCompleted: { type: Boolean, default: false } },
});

const dailyGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exercises: exerciseGoalSchema,
  date: {
    type: Date,
    default: Date.now
  }
});

const DailyGoal = mongoose.model('DailyGoal', dailyGoalSchema);

module.exports = DailyGoal;




