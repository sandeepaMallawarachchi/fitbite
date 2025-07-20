const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.post('/saveMessage', verifyToken, chatController.saveMessage);
router.get('/getMessages/:userId', verifyToken, chatController.getMessages);

module.exports = router;