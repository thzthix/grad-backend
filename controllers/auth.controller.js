const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// // 회원가입
// exports.signup = async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '1d', // 유효기간
//     });
//     res.status(201).send({ user, token });
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };

// 로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).send({ error: '로그인 정보를 확인해주세요.' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // "Bearer TOKEN_STRING" 형태로 가정
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // 비밀번호를 제외한 사용자 정보 조회
    if (!user) {
      return res.status(404).send({ message: "해당 토큰에 해당하는 사용자를 찾을 수 없습니다." });
    }
    res.send(user);
  } catch (error) {
    res.status(401).send({ message: "토큰이 유효하지 않습니다." });
  }
};