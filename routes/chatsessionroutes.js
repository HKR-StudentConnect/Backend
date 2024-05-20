    const express = require('express');
    const { getSessions,createSession } = require('../controllers/chatsessioncontroller');
    const sessionrouter = express.Router();


    sessionrouter.get('/:userId',getSessions);

    sessionrouter.post('/',createSession);

    module.exports = sessionrouter;


