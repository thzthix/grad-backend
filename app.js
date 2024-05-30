const config = require('./utils/config')
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
const authRouter = require('./routes/auth.routes')
const userRouter = require( './routes/user.routes')
const postRouter = require('./routes/post.routes')
const challengeRouter = require('./routes/challenge.routes')
const exerciseStatusRouter = require('./routes/exerciseStatus.routes')
const dailyGoalRouter=require("./routes/dailyGoal.routes")
// const exerciseStatusRouter = require('./routes/exerciseStatus.routes')

// const middleware = require('./utils/middleware')
// app.use(bodyParser.urlencoded({ extended: true })) 대신에
app.use(express.urlencoded({ extended: true }));


const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
      // 스케줄 작업 시작
    require('./scheduler.js');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

  

app.use(cors())
app.use(express.static('dist'))

// app.use(middleware.requestLogger)
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/challenges', challengeRouter)
// app.use('/api/exerciseStatus', exerciseStatusRouter)
app.use('/api/exercise-status',exerciseStatusRouter );
app.use('/api/daily-goals',dailyGoalRouter );


// app.use(middleware.unknownEndpoint)
// app.use(middleware.errorHandler)

module.exports = app
