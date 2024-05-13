
const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

  
    // 새 사용자 생성
router.post("/signup", userController.createUser)
  
    // 모든 사용자 조회
router.get("/", userController.findUsers)
    // 특정 사용자 조회
router.get("/:id", userController.findUser)

      // 사용자 정보 수정
router.put("/:id", userController.updateUser)
        // 사용자 삭제
router.delete("/:id", userController.deleteUser)

    
module.exports = router  
  
