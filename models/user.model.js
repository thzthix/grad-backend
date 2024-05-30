const mongoose = require('mongoose')
const { hashPasswordMiddleware, addIsValidPasswordMethod } = require('../middleware/password.middleware');
const Schema = mongoose.Schema
const ExerciseStatusSchema =require("./ExerciseStatus.model")

// 사용자 스키마
const UserSchema = new Schema({
  firstname:{ type: String, required: true },
  lastname:{ type: String, required: true },
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
        challengeProgress: [{
          challengeId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Challenge'
          },
          progress: {
              type: Number,
              default: 0
          },
          lastUpdated: {
              type: Date,
              default: Date.now
          }
      }],
    },{
    timestamps: true 
});

UserSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.password
    }
  })
  

UserSchema.pre('save', hashPasswordMiddleware)
addIsValidPasswordMethod(UserSchema)


module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

