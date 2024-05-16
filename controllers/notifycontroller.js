const Notification = require('../models/users')

exports.getnotfications = async (req, res) => {
  try {
    const userid = req.params.userId
    const notifcations = await Notification.find({ userid }).sort({
      createdAt: -1,
    })
    res.json(notifcations)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
