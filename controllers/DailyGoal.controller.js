const express = require('express');
const DailyGoal = require('../models/DailyGoal.model');

// 새로운 운동 목표 생성
exports.createDailyGoal = async (req, res) => {
  try {
    const { exercises } = req.body;
    const newGoal = new DailyGoal({
      userId: req.user._id,
      exercises
    });
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateDailyGoal = async (req, res) => {
  try {
    const { id } = req.params; // URL에서 목표 ID를 가져옵니다.
    const { exercises } = req.body; // 요청 본문에서 업데이트할 운동 목표를 가져옵니다.

    // 업데이트할 운동 목표를 동적으로 생성합니다.
    let updateObject = {};
    for (let key in exercises) {
      if (exercises.hasOwnProperty(key)) {
        updateObject[`exercises.${key}.goal`] = exercises[key].goal;
      }
    }

    const updatedGoal = await DailyGoal.findOneAndUpdate(
      { _id: id, userId: req.user._id }, // 사용자 ID와 목표 ID를 기준으로 문서를 찾습니다.
      { $set: updateObject }, // 업데이트할 객체를 사용하여 특정 운동 목표만 업데이트합니다.
      { new: true } // 업데이트된 문서를 반환합니다.
    );

    if (!updatedGoal) {
      return res.status(404).json({ error: 'Goal not found or user not authorized' });
    }

    res.status(200).json(updatedGoal); // 업데이트된 목표를 반환합니다.
  } catch (error) {
    res.status(400).json({ error: error.message }); // 에러 처리
  }
};

// 모든 운동 목표 가져오기
exports.getAllDailyGoals = async (req, res) => {
  try {
    const goals = await DailyGoal.find({ userId: req.user._id });
    if (goals.length === 0) {
      return res.status(404).json({ error: 'No goals found for this date' });
    }
    res.status(200).json(goals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 특정 운동 목표 가져오기
exports.getDailyGoal = async (req, res) => {
  try {
    const goals = await DailyGoal.find({ userId: req.user._id }).sort({ date: -1 }); // 최신 목표부터 정렬
    if (goals.length === 0) {
      return res.status(404).json({ error: 'No goals found' });
    }
    res.status(200).json(goals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserGoals= async (req, res) => {
  try {
    const goals = await DailyGoal.find({ userId: req.user._id }).sort({ date: -1 });
    if (goals.length === 0) {
      return res.status(404).json({ error: 'No goals found' });
    }
    res.status(200).json(goals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}