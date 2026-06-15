const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const postRoutes = require("./routes/posts");
const versionRoutes = require("./routes/versions");
const logRoutes = require("./routes/logs");
const embeddingRoutes = require("./routes/embeddings");
const userRoutes = require("./routes/users");
const commentRoutes = require("./routes/comments");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/posts", postRoutes);
app.use("/versions", versionRoutes);
app.use("/logs", logRoutes);
app.use("/embeddings", embeddingRoutes);
app.use("/users", userRoutes);
app.use("/comments", commentRoutes);

const DEFAULT_LOCAL_MONGO = 'mongodb://127.0.0.1:27017/threadforge'
const mongoUri = process.env.MONGO_URI || DEFAULT_LOCAL_MONGO
const connectionOptions = {
  serverSelectionTimeoutMS: 5000,
}

mongoose
  .connect(mongoUri, connectionOptions)
  .then(() => {
    console.log(`MongoDB Connected to ${mongoUri}`)
  })
  .catch((err) => {
    console.error(`MongoDB connection failed for ${mongoUri}:`, err.message)
    if (mongoUri !== DEFAULT_LOCAL_MONGO) {
      console.log(`Attempting fallback to local MongoDB at ${DEFAULT_LOCAL_MONGO}...`)
      mongoose
        .connect(DEFAULT_LOCAL_MONGO, connectionOptions)
        .then(() => {
          console.log(`MongoDB Connected to local fallback ${DEFAULT_LOCAL_MONGO}`)
        })
        .catch((fallbackErr) => {
          console.error(`Local MongoDB fallback failed:`, fallbackErr.message)
        })
    }
  });

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(
    `Node Server Running On Port ${port}`
  );
});
