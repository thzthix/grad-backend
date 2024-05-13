const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userChallengeSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
    progress: { 
        type: Schema.Types.Mixed, // JSON 형태로 다양한 진행 상황 표현
        required: true, 
        default: {} // 기본값을 빈 객체로 설정
    },
    isCompleted: { type: Boolean, required: true, default: false }, // 완료 여부
    completedAt: { type: Date }, // 완료한 날짜, 완료하지 않았다면 비어있음
    progressUpdates: [{ // 진행 상황 업데이트 기록
        date: { type: Date, default: Date.now },
        detail: Schema.Types.Mixed // 업데이트 내용을 다양하게 기록할 수 있도록 Mixed 타입 사용
    }]
});

const UserChallenge = mongoose.model('UserChallenge', userChallengeSchema);

module.exports = UserChallenge;
