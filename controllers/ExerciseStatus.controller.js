

const { request } = require('express');

const ExerciseStatus = require('../models/ExerciseStatus.model');

exports.addOrUpdateExerciseRecord = async (req, res) => {
  const { userId, date: receivedDate, exercises: receivedExercises } = req.body;

  let date = new Date(receivedDate);
  date.setUTCHours(0, 0, 0, 0);

  try {
    let exerciseStatus = await ExerciseStatus.findOne({ userId });

    if (!exerciseStatus) {
      // 사용자 ID에 대한 문서가 없는 경우 새로운 문서를 생성합니다.
      exerciseStatus = new ExerciseStatus({
        userId,
        exerciseRecords: [{ date, exercises: receivedExercises }]
      });
    } else {
      // 해당 날짜의 기록을 찾습니다.
      let record = exerciseStatus.exerciseRecords.find(record => record.date.toISOString() === date.toISOString());

      if (record) {
        // 해당 날짜의 기록이 있으면, 같은 타입의 운동 세션을 찾아 업데이트하거나 추가합니다.
        receivedExercises.forEach(receivedExercise => {
          let existingExercise = record.exercises.find(exercise => exercise.type === receivedExercise.type);
          if (existingExercise) {
            // 같은 타입의 운동이 있으면, 시간과 칼로리를 합칩니다.
            existingExercise.duration += receivedExercise.duration;
            existingExercise.calories += receivedExercise.calories;
          } else {
            // 같은 타입의 운동이 없으면, 새로운 운동 세션을 추가합니다.
            record.exercises.push(receivedExercise);
          }
        });
      } else {
        // 해당 날짜의 기록이 없으면, 새로운 날짜의 기록을 추가합니다.
        exerciseStatus.exerciseRecords.push({ date, exercises: receivedExercises });
      }
    }

    await exerciseStatus.save();
    res.status(200).json({
      message: "운동 기록이 성공적으로 추가/업데이트되었습니다.",
      exerciseStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류로 인해 운동 기록을 추가/업데이트할 수 없습니다." });
  }
};

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
