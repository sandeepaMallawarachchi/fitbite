const User = require('../models/User');
const Fitness = require('../models/FitnessDetails');


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