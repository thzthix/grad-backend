const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { Mixed } = Schema.Types 

const userChallengeSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true // 인덱싱 추가
    },
    challenge: { 
        type: Schema.Types.ObjectId, 
        ref: 'Challenge', 
        required: true,
        index: true // 인덱싱 추가
    },
    progress: { 
        type: Schema.Types.Mixed, // JSON 형태로 다양한 진행 상황 표현
        required: true, 
        default: {} // 기본값을 빈 객체로 설정
    },
    isCompleted: { type: Boolean, required: true, default: false }, 
    completedAt: { type: Date },
    achievementRate: { 
        type: Number, 
        required: true, 
        default: 0, // 달성률 (0~100)
        validate: { // 달성률이 0에서 100 사이인지 검사
            validator: function(value) {
                return value >= 0 && value <= 100;
            },
            message: 'achievementRate must be between 0 and 100'
        }
    },
    progressUpdates: [{ // 진행 상황 업데이트 기록
        date: { type: Date, default: Date.now },
        detail: Mixed // 업데이트 내용을 다양하게 기록할 수 있도록 Mixed 타입 사용
    }]
});

const UserChallenge = mongoose.model('UserChallenge', userChallengeSchema)

module.exports = UserChallenge
