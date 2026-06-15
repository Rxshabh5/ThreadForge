const express = require("express");
const router = express.Router();

const Post = require("../models/Post");

router.post("/", async (req, res) => {
  try {

    const post = new Post({
      ...req.body,
      postgresId: req.body.postgresId ?? req.body.id
    });

    await post.save();

    res.status(201).json(post);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});

router.get("/", async (req, res) => {
  try {

    const posts = await Post.find();

    res.json(posts);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});

router.delete("/:postgresId", async (req, res) => {
  try {
    const result = await Post.deleteMany({ postgresId: Number(req.params.postgresId) });
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
