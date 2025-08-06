const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

// Public
router.patch('/updateUser', verifyToken, userController.UpdateUserDetails);
router.patch('/updateFitness', verifyToken, userController.updateFitnessDetails);
router.get('/getAllUsers', verifyToken, userController.getAllUsers);
router.get('/getUserById/:userId', verifyToken, userController.getUserById);
router.get('/getFitnessById/:userId', verifyToken, userController.getFitnessById);
router.get("/full-details", verifyToken, userController.getAllFullUserDetails);
router.delete("/restart/:userId", userController.restartUserProfile);
router.post(
    "/upload-profile-pic",
    verifyToken,
    userController.uploadProfilePicMiddleware,
    userController.uploadProfilePic
);
router.delete("/remove-profile-pic", verifyToken, userController.removeProfilePic);

module.exports = router;