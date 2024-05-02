//backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { suspendUser, deleteUser } = require('../controllers/userController');

router.put('/suspend/:userId', verifyToken, admin, suspendUser);
router.delete('/delete/:userId', verifyToken, admin, deleteUser);

module.exports = router;
