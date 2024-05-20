const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/notificationController.js')

// Route to send a follow notification
router.post('/follow', notificationController.sendFollowNotification)

// Route to get notifications for a user
router.get('/:userId', notificationController.getNotifications)

// Route to mark a notification as read
router.patch('/:notificationId/read', notificationController.markAsRead)

module.exports = router
