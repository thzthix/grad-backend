const mongoose = require('mongoose')
const { hashPasswordMiddleware, addIsValidPasswordMethod } = require('../middleware/password.middleware');
const Schema = mongoose.Schema
const ExerciseStatusSchema =require("./ExerciseStatus.model")

// 사용자 스키마
const UserSchema = new Schema({
    name: { type: String, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true }, 
    age: { type: Number, required: true },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
      password: {
        type: String,
        required: true,
      },
      profileImageUrl: { // 사용자 이미지 URL 필드 추가
        type: String,
        required: false,
        default: 'https://austinpeopleworks.com/wp-content/uploads/2020/12/blank-profile-picture-973460_1280.png' // 기본 이미지 URL
      },
    //   todayExerciseStatus: {
    //     type: ExerciseStatusSchema,
    //     default: () => ({})
    // },
    // weeklyExerciseStatus: {
    //     type: [ExerciseStatusSchema],
    //     default: []
    // },

    todayWaterIntake: { type: Number, default: 0 }, // 오늘의 수분 섭취량 (ml 단위)
    completedChallenges: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Challenge'
        }
      ],
      posts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Post'
        }],
    },{
    timestamps: true // 생성 및 수정 시간 기록
});

UserSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      // the passwordHash should not be revealed
      delete returnedObject.password
    }
  })
  
// 미들웨어와 메서드 적용
UserSchema.pre('save', hashPasswordMiddleware)
addIsValidPasswordMethod(UserSchema)

// 'User' 모델로 스키마 컴파일
const User = mongoose.model('User', UserSchema)

module.exports = User
