// const express = require('express')
// const exerciseStatusController = require('../controllers/ExcerciseStatus.controller')
// const { authenticate } = require('../middleware/auth.middleware')

// const router = express.Router()

// // 오늘의 운동 상태 업데이트
// router.put('/user/:id/todayExerciseStatus', authenticate, exerciseStatusController.updateTodayExerciseStatus)

// // 주간 운동 상태 추가
// router.post('/weekly', authenticate, exerciseStatusController.updateWeeklyExerciseStatus)

// router.put('/exercise/:id', authenticate, exerciseStatusController.updateExerciseCalories);


// module.exports = router
const express = require('express');
const router = express.Router();
const exerciseStatusController = require('../controllers/ExerciseStatus.controller');

// 운동 기록 추가 라우트
router.post('/', exerciseStatusController.addOrUpdateExerciseRecord);
router.get('/:userId', exerciseStatusController.getExerciseStatus);
module.exports = router;
