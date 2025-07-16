const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    birthday: { type: Date },
    gender: { type: String, enum: ['Male', 'Female'] },
    weight: { type: String },
    height: { type: String },
    activityLevel: {
        type: String,
        enum: ['Sedentary', 'Light Active', 'Moderate Active', 'Very Active', 'Super Active'],
    },
    role: {
        type: String,
        enum: ['User', 'Coach'],
        default: 'User',
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    picture: { type: String },
    token: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
