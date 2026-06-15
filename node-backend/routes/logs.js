const express = require('express')
const router = express.Router()

const Log = require('../models/Log')

// Create log
router.post('/', async (req, res) => {
  try {
    const l = new Log(req.body)
    await l.save()
    res.status(201).json(l)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// List logs
router.get('/', async (req, res) => {
  try {
    const items = await Log.find().sort({ timestamp: -1 }).limit(200)
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
