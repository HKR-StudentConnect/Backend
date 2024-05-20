const Notification = require('../models/notifications')
const User = require('../models/users')

// Send notification when a user is followed
exports.sendFollowNotification = async (req, res) => {
  try {
    const { recipientId, senderId } = req.body

    // Check if the recipient and sender exist
    const recipient = await User.findById(recipientId)
    const sender = await User.findById(senderId)

    if (!recipient || !sender) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Create a new notification
    const newNotification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type: 'follow',
    })

    // Save the notification
    await newNotification.save()

    res
      .status(201)
      .json({ message: 'Notification sent', notification: newNotification })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params

    const notifications = await Notification.find({
      recipient: userId,
    }).populate('sender', 'username profile.profilePictureUrl')

    res.status(200).json(notifications)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    )

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    res
      .status(200)
      .json({ message: 'Notification marked as read', notification })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}
