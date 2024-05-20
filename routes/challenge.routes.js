const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challenge.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', challengeController.getAllChallenges);
router.get('/:id', challengeController.getChallenge);
router.post('/', challengeController.createChallenge);
// router.put('/:id', challengeController.updateChallenge);
// router.delete('/:id', challengeController.deleteChallenge);
// // 도전과제 완료 API 엔드포인트
// router.post('/complete', challengeController.verifyChallengeCompletion);
// // 도전과제 진행 상황 업데이트를 위한 라우트 설정
// router.put('/progress', authenticate, challengeController.updateAllChallengeProgress);
// //router.get('/challenge/:challengeId/progress', authenticate, challengeController.getUserChallengeAchievementRates);

module.exports = router;
