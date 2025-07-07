const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

// Public
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Hello ${req.user.role}` });
});

// Admin/Coach only
router.get('/coach-area', verifyToken, authorizeRoles('Coach'), (req, res) => {
  res.json({ message: 'Welcome Coach!' });
});

module.exports = router;
