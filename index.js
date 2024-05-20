// const express = require('express');
// require('dotenv').config()
// const mongoose = require('mongoose');

// const postRouter = require('./controllers/post.controller')
// app.use(express.static('dist'))
// app.use(express.json());
// const cors = require('cors')

// app.use(cors())
// app.use('/api/posts', postRouter)


// // 도전 과제 완료 처리 미들웨어
// async function completeChallenge(req, res) {
//     try {
//         const { userId, challengeId } = req.body; // 요청에서 사용자 ID와 도전 과제 ID 추출

//         // 사용자-도전 과제 문서에서 완료 처리
//         await UserChallenge.findOneAndUpdate(
//             { user: userId, challenge: challengeId },
//             { isCompleted: true, completedAt: new Date() }
//         );

//         // 사용자 문서에서 완료한 과제 목록에 추가
//         await User.findByIdAndUpdate(
//             userId,
//             { $addToSet: { completedChallenges: challengeId } } // $addToSet으로 중복 추가 방지
//         );

//         res.send('도전 과제 완료 처리 완료');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('서버 에러 발생');
//     }
// }

// let notes = [
//     {
//       id: 1,
//       content: "HTML is easy",
//       important: true
//     },
//     {
//       id: 2,
//       content: "Browser can execute only JavaScript",
//       important: false
//     },
//     {
//       id: 3,
//       content: "GET and POST are the most important methods of HTTP protocol",
//       important: true
//     }
//   ]
//   const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
//   }
//   app.use(requestLogger)
// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

// app.get('/api/users', (request, response) => {
//   response.json(notes)
// })
// app.get('/api/users/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const note = notes.find(note => note.id === id)
//     if (note) {
//         response.json(note)
//       } else {
//         response.status(404).end()
//       }
//   })
//   app.delete('/api/notes/:id', (request, response) => {
//     const id = Number(request.params.id)
//     notes = notes.filter(note => note.id !== id)
  
//     response.status(204).end()
//   })
//   const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

// app.post('/api/notes', (request, response) => {
//   const body = request.body

//   if (!body.content) {
//     return response.status(400).json({ 
//       error: 'content missing' 
//     })
//   }

//   const note = {
//     content: body.content,
//     important: Boolean(body.important) || false,
//     id: generateId(),
//   }

//   notes = notes.concat(note)

//   response.json(note)
// })
 




// const router = express.Router();

// router.post('/complete-challenge', completeChallenge); // 도전 과제 완료 처리 API

const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')
const User = require('./models/User.model');
const Post = require('./models/post.model');

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})