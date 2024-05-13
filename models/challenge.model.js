const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const challengeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    target: {
        type: Schema.Types.Mixed, // JSON 객체를 사용하여 다양한 목표를 표현
        required: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    // 기존 필드...
});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
