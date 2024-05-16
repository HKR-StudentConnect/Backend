const express = require('express')
const notifyrouter = express.Router()
const notificationController = require('../controllers/notifycontroller.js')

notifyrouter.get('/:userId', notificationController.getnotfications)

module.exports = notifyrouter
