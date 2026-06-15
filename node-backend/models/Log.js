const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema({
  user: String,
  action: String,
  entityType: String,
  entityId: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Log', LogSchema)
