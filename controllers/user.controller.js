const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); 
const ExerciseStatus=require("../models/ExerciseStatus.model")
const DailyGoal = require("../models/DailyGoal.model")
// 칼로리 계산 함수
const  calculateCalories=(weight, duration, MET = 3.8)=> {
    // 입력값 유효성 검사
    if (weight <= 0 || duration <= 0 || MET <= 0) {
       throw new Error('모든 인자는 0보다 커야합니다.');
   }
   // 칼로리 계산 공식: 칼로리 = MET * 체중(kg) * 시간(hr)
   return MET * weight * (duration / 60); // duration이 분 단위이므로 시간 단위로 변환
}

exports.updateExerciseStatus=async (req, res)=> {
    try {
        const { id } = req.params; // 유저 ID
        const { exercises } = req.body; // 클라이언트로부터 받은 운동 정보
        const user = req.user;
    
        if (!user) {
          throw new Error('사용자를 찾을 수 없습니다.');
        }
    
        const today = new Date();
        const dayOfWeek = today.getDay(); // 요일 (0: 일요일, 6: 토요일)
    
        let totalCaloriesBurned = 0;
        let totalDuration = 0;
        exercises.forEach(exercise => {
          const { duration, MET } = exercise;
          const caloriesBurned = calculateCalories(user.weight, duration, MET);
          exercise.caloriesBurned = caloriesBurned; // 각 운동에 대한 칼로리 세팅
          totalCaloriesBurned += caloriesBurned;
          totalDuration += duration;
        });
    
        const todayExerciseStatus = {
          date: today,
          exercises,
          caloriesBurned: totalCaloriesBurned,
          totalDuration
        };
    
        // 업데이트할 데이터 준비
        const updateData = {
          'todayExerciseStatus': todayExerciseStatus
        };
    
        // 월요일(1)인 경우에만 주간 운동 상태 배열 초기화
        if (dayOfWeek === 1) {
          updateData['weeklyExerciseStatus'] = Array(7).fill(null);
        }
    
        // 오늘의 운동 상태 업데이트
        updateData[`weeklyExerciseStatus.${dayOfWeek}`] = todayExerciseStatus;
    
        // 변경된 필드만 업데이트
        const updatedUser = await User.findOneAndUpdate(
          { _id: id },
          { $set: updateData },
          { new: true }
        );
    
        if (!updatedUser) {
          throw new Error('사용자 정보를 업데이트하는데 실패했습니다.');
        }
    
        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

// 새 사용자 생성
exports.createUser = async (req, res) => {
  const { firstname,lastname,gender, email, password, weight, height, age } = req.body;
    
  if (!email) {
    return res.status(400).send({ message: "이메일은 필수입니다!" });
  }
  if (!firstname||!lastname|| !weight || !height || !age) {
    return res.status(400).send({ message: "모든 필수 정보를 입력해야 합니다!" });
  }

  try {
      // 사용자 객체 생성
      const user = new User({
        firstname,
        lastname,
        gender,
        email,
        password,
        weight,
        height,
        age,
      });

      // 데이터베이스에 사용자 저장
      await user.save();
      const dailyGoal = new DailyGoal({
        userId: user._id,
        exercises: {
          pushup: { goal: 0 },
          squat: { goal: 0 },
          lunge: { goal: 0 },
          sidelunge: { goal: 0 },
        }
      });
      await dailyGoal.save();
  
      // exerciseStatus 생성
      const exerciseStatus = new ExerciseStatus({
        userId: user._id,
        exerciseRecords: []
      });
      await exerciseStatus.save();

      // 로그인 처리
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1d',
      });

      // 비밀번호를 제외한 정보 반환
      const userData = user.toJSON();
      res.send({ user: userData, token }); // 사용자 정보와 토큰 반환
  } catch (err) {
      res.status(500).send({
          message: err.message || "사용자 생성 중 오류가 발생했습니다."
      });
  }
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
// 토큰 검증 및 사용자 정보 반환
