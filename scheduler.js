const User = require('./models/User.model');
const Challenge = require('./models/Challenge.model');

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

// 예: 매일 자정에 실행
const cron = require('node-cron');
cron.schedule('0 0 * * *', resetDailyChallenges);
