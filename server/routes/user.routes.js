const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

// Public
router.patch('/updateUser', verifyToken, userController.UpdateUserDetails);
router.patch('/updateFitness', verifyToken, userController.updateFitnessDetails);
router.get('/getUserById/:userId', verifyToken, userController.getUserById);

module.exports = router;