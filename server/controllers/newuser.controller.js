const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
