const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

// Public
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
