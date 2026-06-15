const mongoose = require('mongoose')

const EmbeddingSchema = new mongoose.Schema({
  postId: Number,
  title: String,
  category: String,
  keywords: [String],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Embedding', EmbeddingSchema)
