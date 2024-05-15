// auth.middleware.js
const jwt = require('jsonwebtoken')
const Post = require('../models/post.model')
const User = require("../models/user.model")

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}



// 인증 미들웨어
const authenticate = async (req, res, next) => {
  try {
    const token = getTokenFrom(req);
    if (!token) {
      throw new Error('Token not provided');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken.id) {
      throw new Error('Token invalid');
    }
    const user = await User.findById(decodedToken.id);
    if (!user) {
      throw new Error('User not found');
    }
    req.user = user; // 여기에서 req.user를 설정합니다.
    next(); // 다음 미들웨어로 이동합니다.
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const checkPostOwner = async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id); // URL 경로에 따라 postId가 다를 수 있습니다.
      if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }
      // 게시글의 작성자와 로그인한 사용자 비교
      if (post.author.toString() !== req.user.id) {
        return res.status(403).json({ message: '이 작업을 수행할 권한이 없습니다.' });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  };

module.exports = { authenticate, checkPostOwner };
