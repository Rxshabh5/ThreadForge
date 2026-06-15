const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  postgresId: Number,
  username: String,
  email: {
    type: String,
    index: true,
    unique: true
  },
  password: String,
  role: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', UserSchema)
