const User = require('./models/User.model');
const Challenge = require('./models/Challenge.model');
const DailyGoal = require("./models/DailyGoal.model")
async function resetDailyGoals() {
    try {
        // 모든 DailyGoal의 progress를 0으로 설정
        await DailyGoal.updateMany({}, { $set: { progress: 0 } });
        console.log('모든 DailyGoal의 progress가 성공적으로 리셋되었습니다.');
    } catch (error) {
        console.error('DailyGoal 리셋 중 오류 발생:', error);
    }
}


async function resetDailyChallenges() {
    const dailyChallenges = await Challenge.find({ type: 'daily' });
    const users = await User.find({});

    users.forEach(user => {
        dailyChallenges.forEach(challenge => {
            const existingProgress = user.challengeProgress.find(progress => progress.challengeId.equals(challenge._id));
            if (!existingProgress) {
                user.challengeProgress.push({ challengeId: challenge._id, progress: 0 });
            } else {
                existingProgress.progress = 0;
                existingProgress.lastUpdated = new Date();
            }
        });
        user.save();
    });
}

const cron = require('node-cron');
cron.schedule('0 0 * * *', resetDailyChallenges);
cron.schedule('0 0 * * *', resetDailyGoals);
