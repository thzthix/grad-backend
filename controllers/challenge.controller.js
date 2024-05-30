// challengesController.js

const Challenge = require('../models/Challenge.model');
const User = require('../models/User.model');
const UserChallenge = require('../models/UserChallenge.model');


exports.createChallenge = async (req, res) => {
  try {
    const { name, type,exercise, targetCount, description, startDate, endDate } = req.body;

    // 새 도전 과제 객체 생성
    const newChallenge = new Challenge({
      name,
      type,
      exercise,
      targetCount,
      description,
      startDate,
      endDate,
    });

    // 데이터베이스에 도전 과제 저장
    const savedChallenge = await newChallenge.save();

    // 성공 응답 보내기
    res.status(201).json(savedChallenge);
  } catch (error) {
    // 에러 처리
    console.error(error);
    res.status(500).json({ message: "도전 과제를 생성하는 중 오류가 발생했습니다." });
  }
};
exports.createUserChallenge=async(req,res)=>{
  const { name, exercise, targetCount,} = req.body;

  // 필수 필드 확인
  if (!name || !exercise || !targetCount) {
    return res.status(400).json({ error: 'name, exercise, targetCount는 필수 항목입니다.' });
  }

  try {
    const newChallenge = new Challenge({
      name,
      exercise,
      type: 'user', // type 필드를 'user'로 설정
      targetCount,
    });

    const savedChallenge = await newChallenge.save();
    res.status(201).json(savedChallenge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '도전 과제 생성 중 오류가 발생했습니다.' });
  }

}


exports.updateAllChallengeProgress = async (req, res) => {
    const userId = req.user._id;
    const activityDetails = req.body; // 운동 세부 사항, 예: {todayExerciseStatus, weeklyExerciseStatus, todayWaterIntake}
  
    try {
      const userChallenges = await UserChallenge.find({ user: userId });
  
      const updatePromises = userChallenges.map(async (userChallenge) => {
        const challenge = await Challenge.findById(userChallenge.challenge);
        let progressUpdate = 0; // 달성률 업데이트를 위한 변수
  
        switch (challenge.type) {
          case 'dailyCount': {
            const exerciseCount = Object.values(activityDetails.todayExerciseStatus.exercises).filter(ex => ex.count > 0).length;
            progressUpdate = (exerciseCount / challenge.dynamicFields.get('targetCount')) * 100;
            break;
          }
          case 'weeklyCount': {
            let weeklyExerciseCount = 0;
            activityDetails.weeklyExerciseStatus.forEach(day => {
              if (Object.values(day.exercises).filter(ex => ex.count > 0).length >= challenge.dynamicFields.get('targetCount')) {
                weeklyExerciseCount++;
              }
            });
            progressUpdate = (weeklyExerciseCount / 1) * 100; // '1'은 최소 한 번 조건 충족을 의미
            break;
          }
          case 'everyday': {
            const isEveryday = activityDetails.weeklyExerciseStatus.length === 7 && activityDetails.weeklyExerciseStatus.every(day => 
              Object.values(day.exercises).some(ex => ex.count > 0 || ex.duration > 0)
            );
            progressUpdate = isEveryday ? 100 : 0;
            break;
          }
          case 'totalDuration': {
            const totalDuration = activityDetails.todayExerciseStatus.totalDuration; // 분 단위
            progressUpdate = (totalDuration / challenge.dynamicFields.get('targetDuration')) * 100;
            break;
          }
          case 'perExercise': {
            const exercises = activityDetails.todayExerciseStatus.exercises;
            const targetExercises = challenge.dynamicFields.get('exercises');
            const progressPerExercise = Object.keys(targetExercises).map(exercise => 
              exercises[exercise] && exercises[exercise].count >= targetExercises[exercise] ? 1 : 0
            );
            progressUpdate = (progressPerExercise.reduce((acc, curr) => acc + curr, 0) / Object.keys(targetExercises).length) * 100;
            break;
          }
          case 'calories': {
            const calories = calculateCalories(activityDetails.todayExerciseStatus); // 이 함수는 운동 상태를 바탕으로 칼로리를 계산해야 함
            progressUpdate = (calories / challenge.dynamicFields.get('targetCalories')) * 100;
            break;
          }
          case 'waterIntake': {
            const waterIntake = activityDetails.todayWaterIntake; // ml 단위
            progressUpdate = (waterIntake / challenge.dynamicFields.get('targetWaterIntake')) * 100;
            break;
          }
          default:
            console.log(`Unrecognized challenge type: ${challenge.type}`);
        }
  
        userChallenge.progress = Math.min(Math.max(userChallenge.progress, progressUpdate), 100); // 이미 달성된 진행률보다 낮은 경우 업데이트하지 않음, 100%를 초과하지 않도록 함
        await userChallenge.save(); // 업데이트된 도전과제 저장
      });
  
      await Promise.all(updatePromises);
  
      res.status(200).json({ message: 'All challenges updated successfully.' });
    } catch (error) {
      console.error('Error updating all challenges:', error);
      res.status(500).json({ error: error.message });
    }
};


  
// 도전과제 달성
// 사용자가 도전과제를 완료했을 때 호출될 함수
  exports.verifyChallengeCompletion = async (req, res) => {
    const userId = req.user.id; // 인증 미들웨어에서 설정한 req.user를 사용
    const challengeId = req.params.challengeId; // 요청 URL에서 challengeId를 가져옴

    try {
      const user = await User.findById(userId);
      const challenge = await Challenge.findById(challengeId);
  
      let isCompleted = false;
  
      // 도전과제 유형에 따른 검증 로직
          // 도전과제 유형에 따른 검증 로직
          switch (challenge.type) {
            case 'dailyCount':
              // 예: 하루에 네 가지 이상 운동하기
              const exerciseCount = Object.values(user.todayExerciseStatus.exercises).filter(ex => ex.count > 0).length;
              isCompleted = exerciseCount >= challenge.dynamicFields.get('targetCount');
              break;
            case 'weeklyCount':
              // 예: 일주일 동안 운동 하루에 네 가지 이상 하기
              let weeklyExerciseCount = 0;
              user.weeklyExerciseStatus.forEach(day => {
                if (Object.values(day.exercises).filter(ex => ex.count > 0).length >= challenge.dynamicFields.get('targetCount')) {
                  weeklyExerciseCount++;
                }
              });
              isCompleted = weeklyExerciseCount >= 1; // 적어도 한 번은 조건 충족
              break;
            case 'everyday':
              // 예: 일주일동안 매일매일 운동하기
              isCompleted = user.weeklyExerciseStatus.length === 7 && user.weeklyExerciseStatus.every(day => 
                Object.values(day.exercises).some(ex => ex.count > 0 || ex.duration > 0)
              );
              break;
            case 'totalDuration':
              // 예: 운동 몇시간 이상 하기
              const totalDuration = user.todayExerciseStatus.totalDuration; // 분 단위
              isCompleted = totalDuration >= challenge.dynamicFields.get('targetDuration');
              break;
            case 'perExercise':
              // 예: 운동종류별 하루 목표 횟수
              isCompleted = Object.entries(user.todayExerciseStatus.exercises).every(([key, val]) => 
                !challenge.dynamicFields.get('exercises') || (val.count >= challenge.dynamicFields.get('exercises')[key])
              );
              break;
            case 'calories':
              // 예: 칼로리 소모량
              const calories = calculateCalories(user.todayExerciseStatus); // 여기서 calculateCalories는 운동 상태를 바탕으로 칼로리를 계산하는 함수입니다.
              isCompleted = calories >= challenge.dynamicFields.get('targetCalories');
              break;
            case 'waterIntake':
              // 예: 물 섭취
              const waterIntake = user.todayWaterIntake; // ml 단위
              isCompleted = waterIntake >= challenge.dynamicFields.get('targetWaterIntake');
              break;
            // 다른 도전과제 유형에 대한 검증 로직 추가...
            default:
              throw new Error('Unknown challenge type');
          }

      if (isCompleted) {
        // 도전과제 완료 처리
        user.completedChallenges.push(challengeId);
        challenge.completedBy.push(userId)
        await user.save();
        res.json({ success: true }); // 도전과제 완료 여부를 응답으로 반환
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error('Error verifying challenge completion:', error);
      res.status(500).json({ error: error.message }); // 에러 발생 시 에러 메시지를 응답으로 반환
    }
  };

  
exports.completeChallenge = async (req, res) => {
  try {
    const { userId, challengeId } = req.body;
    const user = await User.findById(userId);
    const challenge = await Challenge.findById(challengeId);

    if (!user || !challenge) {
      return res.status(404).send('사용자 또는 도전과제를 찾을 수 없습니다.');
    }

    user.challengesCompleted.push(challenge)
    challenge.completedBy.push(userId)
    await challenge.save()
    await user.save();

    res.status(200).send('도전과제가 성공적으로 추가되었습니다.');
  } catch (error) {
    res.status(500).send(error.message);
  }
};



// 모든 도전과제 조회
exports.getAllChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find({});
        res.status(200).json(challenges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 특정 도전과제 조회
exports.getChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.status(200).json(challenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 도전과제 생성
exports.createChallenge = async (req, res) => {
    try {
        const newChallenge = new Challenge(req.body);
        const savedChallenge = await newChallenge.save();
        res.status(201).json(savedChallenge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 도전과제 업데이트
exports.updateChallenge = async (req, res) => {
    try {
        const updatedChallenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedChallenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.status(200).json(updatedChallenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 도전과제 삭제
exports.deleteChallenge = async (req, res) => {
    try {
        const deletedChallenge = await Challenge.findByIdAndDelete(req.params.id);
        if (!deletedChallenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.status(200).json({ message: 'Challenge deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
