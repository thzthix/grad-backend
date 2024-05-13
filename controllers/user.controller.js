const User = require('../models/user.model'); 

// 새 사용자 생성
exports.createUser = (req, res) => {
  // 요청에서 사용자 정보 검증
  if (!req.body.email) {
    res.status(400).send({ message: "이메일은 필수입니다!" });
    return;
  }

  // 사용자 객체 생성
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  // 데이터베이스에 사용자 저장
  user
    .save(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "사용자 생성 중 오류가 발생했습니다."
      });
    });
};

// 모든 사용자 조회
exports.findUsers = (req, res) => {
  User.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "사용자 조회 중 오류가 발생했습니다."
      });
    });
};

// 특정 사용자 조회
exports.findUser= (req, res) => {
    const id = req.params.id;

    User.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found User with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving User with id=" + id });
        });
};
// 사용자 정보 수정
exports.updateUser = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update User with id=${id}. Maybe User was not found!`
                });
            } else res.send({ message: "User was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};
// 사용자 삭제
exports.deleteUser = (req, res) => {
    const id = req.params.id;

    User.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            } else {
                res.send({
                    message: "User was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};