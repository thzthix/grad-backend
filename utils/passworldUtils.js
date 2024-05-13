const bcrypt = require('bcrypt');

// 비밀번호 해싱 함수
async function hashPassword(password) {
  return await bcrypt.hash(password, 8);
}

// 비밀번호 검증 함수
async function comparePassword(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

module.exports = { hashPassword, comparePassword };
