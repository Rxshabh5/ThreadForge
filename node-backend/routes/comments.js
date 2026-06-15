const express = require('express')
const router = express.Router()

const Comment = require('../models/Comment')

router.post('/', async (req, res) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { postgresId: req.body.postgresId ?? req.body.id },
      {
        ...req.body,
        postgresId: req.body.postgresId ?? req.body.id,
        updatedAt: new Date()
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find()
    res.json(comments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: Number(req.params.postId) })
    res.json(comments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.patch('/:postgresId', async (req, res) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { postgresId: Number(req.params.postgresId) },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    )

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    res.json(comment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/post/:postId', async (req, res) => {
  try {
    const result = await Comment.deleteMany({ postId: Number(req.params.postId) })
    res.json({ deletedCount: result.deletedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
