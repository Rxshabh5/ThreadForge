const express = require('express')
const router = express.Router()

const Version = require('../models/Version')

// Create version
router.post('/', async (req, res) => {
  try {
    const v = new Version(req.body)
    await v.save()
    res.status(201).json(v)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// List versions (optional query by postId)
router.get('/', async (req, res) => {
  try {
    const { postId } = req.query
    const query = postId ? { postId: Number(postId) } : {}
    const items = await Version.find(query).sort({ timestamp: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
