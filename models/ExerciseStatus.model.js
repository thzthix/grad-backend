
const mongoose = require('mongoose');

const ExerciseSessionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['pushup', 'lunge', 'squat','jumpingjack','sidelunge','highknees']
  },
  count:{
    type:Number,
    required:true
  },
  duration: {
    type: Number,
    required: true
  },
  calories: {
    type: Number,
    required: true
  }
});

const ExerciseRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  exercises: [ExerciseSessionSchema] // 운동 세션을 저장할 배열
});

const ExerciseStatusSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  exerciseRecords: [ExerciseRecordSchema] // 날짜별로 운동 기록을 저장할 배열
});

module.exports = mongoose.model('ExerciseStatus', ExerciseStatusSchema);

