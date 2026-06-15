const express = require('express')
const router = express.Router()

const Embedding = require('../models/Embedding')

// Create embedding
router.post('/', async (req, res) => {
  try {
    const e = new Embedding(req.body)
    await e.save()
    res.status(201).json(e)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// List embeddings
router.get('/', async (req, res) => {
  try {
    const items = await Embedding.find().sort({ createdAt: -1 }).limit(500)
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
