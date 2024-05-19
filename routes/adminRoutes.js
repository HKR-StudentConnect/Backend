const express = require('express')
const router = express.Router()
const { verifyToken, admin } = require('../middleware/auth')
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')

router.get(
  '/dashboard-stats',
  verifyToken,
  admin,
  userController.getDashboardStats
)
router.put('/suspend/:userId', verifyToken, admin, userController.suspendUser)
router.put(
  '/unsuspend/:userId',
  verifyToken,
  admin,
  userController.unsuspendUser
)
router.delete('/delete/:userId', verifyToken, admin, userController.deleteUser)
router.post(
  '/send-notification',
  verifyToken,
  admin,
  postController.sendNotification
)

module.exports = router
