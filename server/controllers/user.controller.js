const User = require('../models/User');
const Fitness = require('../models/FitnessDetails');
const ChatHistory = require('../models/ChatHistory');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config();

exports.UpdateUserDetails = async (req, res) => {
  try {
    const userId = req.body.userId;

    const { name, email, phone, birthday, gender, weight, height, activityLevel } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phone,
        birthday,
        gender,
        weight,
        height,
        activityLevel,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User details updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update details', error: err.message });
  }
};

exports.updateFitnessDetails = async (req, res) => {
  try {
    const { userId, updateData } = req.body;

    if (!userId || !updateData) {
      return res.status(400).json({ message: 'userId and updateData are required' });
    }

    const updatedFitness = await Fitness.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Fitness details updated successfully',
      fitness: updatedFitness,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update fitness details', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {

    const userDetails = await User.find();

    if (!userDetails || userDetails.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    res.status(200).json({ userDetails });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to find users.',
      error: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const userDetails = await User.findById(userId);

    if (!userDetails || userDetails.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ userDetails });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to find user details.',
      error: error.message,
    });
  }
};

exports.getFitnessById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const fitnessDetails = await Fitness.findOne({ userId });

    if (!fitnessDetails || fitnessDetails.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ fitnessDetails });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to find fitness details.',
      error: error.message,
    });
  }
};

exports.getAllFullUserDetails = async (req, res) => {
  try {
    const users = await User.find({ role: "User" });

    const results = await Promise.all(
      users.map(async (user) => {
        const fitness = await Fitness.findOne({ userId: user._id });
        return {
          userDetails: user,
          fitnessDetails: fitness || null,
        };
      })
    );

    res.status(200).json({ userDetails: results });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve full user details.",
      error: error.message,
    });
  }
};


exports.restartUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Delete records from all models related to userId
    const [userDel, fitnessDel, chatDel] = await Promise.all([
      User.findByIdAndDelete(userId),
      Fitness.deleteMany({ userId: new ObjectId(userId) }),
      ChatHistory.deleteMany({ userId }),
    ]);

    if (!userDel) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User and related data deleted successfully.",
      deletedUser: userDel,
      deletedFitnessCount: fitnessDel.deletedCount,
      deletedChatCount: chatDel.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user data.",
      error: error.message,
    });
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadProfilePicMiddleware = upload.single("image");

exports.uploadProfilePic = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "profile_pics" },
      async (error, result) => {
        if (error) return res.status(500).json({ error });

        await User.findByIdAndUpdate(userId, { picture: result.secure_url });
        res.status(200).json({ imageUrl: result.secure_url });
      }
    );

    if (req.file) {
      result.end(req.file.buffer);
    } else {
      res.status(400).json({ error: "No image uploaded" });
    }
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};