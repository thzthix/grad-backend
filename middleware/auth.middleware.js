// auth.middleware.js
const jwt = require('jsonwebtoken');
import Post from '../models/post.model';
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // "Bearer <token>"

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // 유효하지 않은 토큰
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); // 토큰 미제공
  }
};
const checkPostOwner = async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.postId); // URL 경로에 따라 postId가 다를 수 있습니다.
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
