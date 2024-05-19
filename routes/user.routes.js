
const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const { authenticate } = require('../middleware/auth.middleware'); // authenticate 미들웨어가 정의된 파일의 경로로 대체


  
    // 새 사용자 생성
router.post("/signup", userController.createUser)
  
    // 모든 사용자 조회
router.get("/", userController.findUsers)
    // 특정 사용자 조회
router.get("/:id", userController.findUser)
router.post('/:id/updateTodayExerciseStatus', authenticate,userController.updateExerciseStatus);
      // 사용자 정보 수정
router.put("/:id", authenticate, userController.updateUser)
        // 사용자 삭제
router.delete("/:id",authenticate, userController.deleteUser)

    
module.exports = router  
  
