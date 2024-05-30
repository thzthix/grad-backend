const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const dailyGoalController=require("../controllers/DailyGoal.controller")


router.get('/', authenticate,dailyGoalController.getUserGoals);
router.get('/:id', authenticate,dailyGoalController.getDailyGoal);
router.post('/', authenticate,dailyGoalController.createDailyGoal);
router.put('/:id', authenticate,dailyGoalController.updateDailyGoal);

module.exports = router;