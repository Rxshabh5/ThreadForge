const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  postgresId: Number,
  title: String,
  content: String,
  category: String,
  authorEmail: String,
  authorRole: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", PostSchema);