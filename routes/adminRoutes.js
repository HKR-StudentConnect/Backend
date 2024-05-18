// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, admin } = require('../middleware/auth');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const adminController = require('../controllers/adminController'); // Import the new adminController

router.post('/login', adminController.adminLogin); // Update this line to handle admin login
router.get('/dashboard-stats', verifyToken, admin, userController.getDashboardStats);
router.put('/suspend/:userId', verifyToken, admin, userController.suspendUser);
router.delete('/delete/:userId', verifyToken, admin, userController.deleteUser);
router.post('/send-notification', verifyToken, admin, postController.sendNotification);
router.post('/post-event', verifyToken, admin, postController.createPost);
router.get('/users', verifyToken, admin, userController.getAllUsers);

module.exports = router;


