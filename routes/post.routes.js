const express = require('express')
const router = express.Router()
const postController = require('../controllers/post.controller')
const { authenticate, checkPostOwner } = require('../middleware/auth.middleware')


// 게시글 생성
router.post('/', authenticate, postController.createPost);

// 게시글 상세 조회
router.get('/:id', postController.getPost);

// 게시글 목록 조회
router.get('/', postController.getPosts);

// 게시글 수정
router.put('/:id', authenticate,checkPostOwner,postController.updatePost);

// 게시글 삭제
router.delete('/:id', authenticate,checkPostOwner,postController.deletePost);

module.exports = router;
