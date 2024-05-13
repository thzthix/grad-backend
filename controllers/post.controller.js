const Post = require('../models/post.model'); // Post 모델 가져오기
// 게시글 생성
exports.createPost = async (req, res) => {
    try {
      const { title, content } = req.body;
      // req.user는 인증 미들웨어에서 설정된 값으로, 로그인한 사용자의 정보를 포함합니다.
      const author = req.user._id;
      const newPost = new Post({ author, title, content });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

// 게시글 상세 조회
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
    
  }
};

// 게시글 목록 조회
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 게시글 수정
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
    
        if (!post) {
          return res.status(404).json({ message: 'Post not found' })
        }
        const { title, content } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true })
    
        res.status(200).json(updatedPost)
      } catch (error) {
        res.status(400).json({ message: error.message })
      }
}

// 게시글 삭제
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
