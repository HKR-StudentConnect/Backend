const Event = require('../models/events')

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 })
    res.status(200).json(events)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

exports.createEvent = async (req, res) => {
  const { title, imageUrl, location, date } = req.body

  if (!title || !date || !location) {
    return res.status(400).json({ message: 'Title and date are required' })
  }

  const event = new Event({
    title,
    imageUrl,
    location,
    date,
  })

  try {
    const savedEvent = await event.save()
    res.status(201).json(savedEvent)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
