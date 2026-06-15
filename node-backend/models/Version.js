const mongoose = require('mongoose')

const VersionSchema = new mongoose.Schema({
  postId: Number,
  title: String,
  content: String,
  category: String,
  authorEmail: String,
  versionNumber: Number,
  timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Version', VersionSchema)
