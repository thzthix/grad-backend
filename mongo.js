const mongoose = require('mongoose');
const User = require('./models/user.model'); // User 모델 경로에 맞게 수정하세요.
const Post = require('./models/post.model'); // Post 모델 경로에 맞게 수정하세요.

const password = "seohas0428";

// MongoDB URL. 실제 환경에 맞게 수정하세요.
const url = `mongodb+srv://seohas0428:${password}@cluster0.kkwu88k.mongodb.net/healthApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');

    // 새로운 User 생성
    const user = new User({
      name: '홍길동',
      email: 'honggildong@example.com',
      passwordHash: 'hashed_password', // 실제 애플리케이션에서는 비밀번호 해싱이 필요합니다.
    });

    return user.save();
  })
  .then(savedUser => {
    console.log('User saved', savedUser);

    // 새로운 Post 생성, 방금 생성된 User를 author로 참조
    const post = new Post({
      author: savedUser._id,
      title: "새로운 게시글",
      content: "게시글 내용입니다."
    });

    return post.save();
  })
  .then(savedPost => {
    console.log('Post saved', savedPost);
    return mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
    mongoose.connection.close();
  });
