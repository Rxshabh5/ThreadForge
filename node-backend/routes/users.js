const express = require('express')
const router = express.Router()

const User = require('../models/User')

router.post('/', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      {
        ...req.body,
        postgresId: req.body.postgresId ?? req.body.id,
        updatedAt: new Date()
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/:postgresId/role', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { postgresId: Number(req.params.postgresId) },
      { role: req.body.role, updatedAt: new Date() },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/:postgresId', async (req, res) => {
  try {
    const result = await User.deleteMany({ postgresId: Number(req.params.postgresId) })
    res.json({ deletedCount: result.deletedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
