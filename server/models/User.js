const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    birthday: { type: Date, required: true },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    weight: { type: String, required: true },
    height: { type: String, required: true },
    activityLevel: {
        type: String,
        enum: ['Sedentary', 'Light Active', 'Moderate Active', 'Very Active', 'Super Active'],
        required: true,
    },
    role: {
        type: String,
        enum: ['User', 'Coach'],
        default: 'User',
    },
    picture: { type: String },
    token: { type: String },
    role: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
