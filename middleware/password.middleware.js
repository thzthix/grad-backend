const { hashPassword, comparePassword } = require('../utils/passworldUtils');

// 비밀번호 해싱 미들웨어
async function hashPasswordMiddleware(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await hashPassword(user.password);
  }
  next();
}

// 비밀번호 검증 메서드
function addIsValidPasswordMethod(schema) {
  schema.methods.isValidPassword = async function(password) {
    return await comparePassword(password, this.password);
  };
}

module.exports = { hashPasswordMiddleware, addIsValidPasswordMethod };
