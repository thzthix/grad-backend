const mongoose = require('mongoose')

const Schema = mongoose.Schema

const url = process.env.MONGODB_URI


const postSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    
},{
  timestamps: true
});


postSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Post = mongoose.model('Post', postSchema)

module.exports = Post
