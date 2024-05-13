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
