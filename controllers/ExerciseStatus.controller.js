const ExerciseStatus = require('../models/ExerciseStatus.model');
const User = require('../models/User.model');
const Challenge = require('../models/Challenge.model');
const DailyGoal = require ("../models/DailyGoal.model")

const updateDailyGoalProgress = async (userId, receivedExercises) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 오늘 날짜의 DailyGoal 찾기
  const dailyGoal = await DailyGoal.findOne({
    userId,
    // date: {$gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)}
  });

  if (!dailyGoal) return; // 오늘 날짜의 DailyGoal이 없다면 함수 종료

  receivedExercises.forEach(exercise => {
    const { type, count } = exercise; // duration 대신 count를 사용, 필요에 따라 조정하세요.

    if (dailyGoal.exercises[type]) { // 해당 타입의 운동이 DailyGoal에 존재하는 경우
      let exerciseGoal = dailyGoal.exercises[type];
      exerciseGoal.progress += count; // 운동 진행 상태 업데이트

      if (exerciseGoal.progress >= exerciseGoal.goal) { // 목표 달성 여부 확인
        exerciseGoal.isCompleted = true;
      }

      dailyGoal.exercises[type] = exerciseGoal; // 업데이트된 운동 목표로 다시 할당
    }
  });

  await dailyGoal.save(); // 변경사항 저장
};


// 도전 과제 진행 상황을 업데이트하는 함수
async function updateChallengeProgress(userId, receivedExercises) {
   // 현재 날짜를 기준으로 진행 중인 모든 도전 과제를 조회합니다.
   const challenges = await Challenge.find({
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() } // endDate가 설정되어 있는 경우만 고려
  });
  
  // 사용자 정보 조회
  const user = await User.findById(userId);
  
  // 각 도전 과제에 대해
  for (let challenge of challenges) {
    for (let receivedExercise of receivedExercises) {
      // 도전 과제의 종류와 받은 운동의 종류가 일치하는 경우
      if (challenge.exercise === receivedExercise.type) {
        // 사용자의 도전 과제 진행 상황을 찾거나 새로 생성합니다.
        let progress = user.challengeProgress.find(p => p.challengeId.equals(challenge._id));
        if (!progress) {
          progress = {
            challengeId: challenge._id,
            progress: 0,
            lastUpdated: new Date()
          };
          user.challengeProgress.push(progress);
        }
        
        // 진행 상황 업데이트
        progress.progress += receivedExercise.count;
        progress.lastUpdated = new Date();
        
        // 도전 과제를 완료한 경우
        if (progress.progress >= challenge.targetCount && !user.completedChallenges.includes(challenge._id)) {
          user.completedChallenges.push(challenge._id);
        }
      }
    }
  }
  await user.save();
}
exports.addOrUpdateExerciseRecord = async (req, res) => {
  const { userId, date: receivedDate, exercises: receivedExercises } = req.body;

  let date = new Date(receivedDate);
  date.setUTCHours(0, 0, 0, 0);

  try {
    let exerciseStatus = await ExerciseStatus.findOne({ userId });

    if (!exerciseStatus) {
      exerciseStatus = new ExerciseStatus({
        userId,
        exerciseRecords: [{ date, exercises: receivedExercises }]
      });
    } else {
      let record = exerciseStatus.exerciseRecords.find(record => record.date.toISOString() === date.toISOString());

      if (record) {
        receivedExercises.forEach(receivedExercise => {
          let existingExercise = record.exercises.find(exercise => exercise.type === receivedExercise.type);
          if (existingExercise) {
            existingExercise.duration += receivedExercise.duration;
            existingExercise.calories += receivedExercise.calories;
          } else {
            record.exercises.push(receivedExercise);
          }
        });
      } else {
        exerciseStatus.exerciseRecords.push({ date, exercises: receivedExercises });
      }
    }

    await exerciseStatus.save();
    await updateChallengeProgress(userId, receivedExercises);
    await updateDailyGoalProgress(userId, receivedExercises);
    
    res.status(200).json({
      message: "운동 기록이 성공적으로 추가/업데이트되었습니다.",
      exerciseStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류로 인해 운동 기록을 추가/업데이트할 수 없습니다." });
  }
};

async function updateChallenges(userId, date, receivedExercises) {
  let user = await User.findById(userId).populate('challengeProgress.challengeId');

  user.challengeProgress.forEach(progress => {
    let challenge = progress.challengeId;
    let isChallengeUpdated = false;

    switch (challenge.type) {
      case 'specificExercise':
        receivedExercises.forEach(exercise => {
          if (exercise.type === challenge.exerciseType) {
            progress.progress += exercise.duration;
            isChallengeUpdated = true;
          }
        });
        break;
      case 'weeklyFrequency':
        // 주간 빈도 체크 로직
        break;
      case 'dailyVariety':
        // 하루에 다양한 운동 체크 로직
        break;
      case 'weeklyVariety':
        // 주간 다양한 운동 체크 로직
        break;
      case 'dailyMultiExercise':
        // 매일 여러 운동 체크 로직
        break;
    }

    if (isChallengeUpdated && progress.progress >= challenge.target) {
      user.completedChallenges.push(challenge._id);
      user.challengeProgress = user.challengeProgress.filter(p => p.challengeId._id.toString() !== challenge._id.toString());
    }

    progress.lastUpdated = Date.now();
  });

  await user.save();
}
// 운동 상태 조회 컨트롤러
exports.getExerciseStatus = async (req, res) => {
  const { userId } = req.params; // 또는 req.query를 사용해 요청에서 userId를 받을 수 있습니다.

  try {
    const exerciseStatus = await ExerciseStatus.findOne({ userId });

    if (!exerciseStatus) {
      // 사용자 ID에 해당하는 운동 기록이 없는 경우
      return res.status(404).json({ message: "운동 기록을 찾을 수 없습니다." });
    }

    // 운동 기록이 있는 경우
    res.status(200).json({
      message: "운동 기록 조회 성공",
      exerciseStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류로 인해 운동 기록을 조회할 수 없습니다." });
  }
};
