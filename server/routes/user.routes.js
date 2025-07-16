const express = require('express');
const router = express.Router();
const userController = require('../controllers/newuser.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

// Public
router.patch('/updateUser', userController.UpdateUserDetails);
router.patch('/updateFitness', userController.updateFitnessDetails);

module.exports = router;