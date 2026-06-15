const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  postgresId: Number,
  postId: Number,
  authorEmail: String,
  authorName: String,
  authorHandle: String,
  body: String,
  likes: {
    type: Number,
    default: 0
  },
  createdAt: String,
  syncedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Comment', CommentSchema)
