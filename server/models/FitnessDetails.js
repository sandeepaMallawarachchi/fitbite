const mongoose = require('mongoose');
const { Schema } = mongoose;

const fitnessSchema = new Schema({
    userId: { type: String, required: true },

    TDEE: { type: String, required: true },

    fitnessGoal: {
        primaryGoal: {
            type: String,
            required: true,
            enum: ['Maintain', 'FatLoss', 'MuscleGain'],
        },
        goalWeight: { type: String },
        progress: { type: String },
    },

    mealHabits: {
        dailyMeals: { type: String, required: true },
        mealsSchedule: {
            breakfast: { type: String, required: true },
            lunch: { type: String, required: true },
            dinner: { type: String, required: true },
        },
        cookAtHome: {
            type: String,
            required: true,
            enum: ['Daily', 'Rarely', 'Few times/week'],
        },
        ability: {
            type: String,
            required: true,
            enum: ['Yes', 'No'],
        },
        grosaryBudget: {
            type: String,
            required: true,
            enum: ['Friendly', 'Moderate', 'Flexible'],
        },
    },

    dietaryDetails: {
        preference: {
            type: String,
            required: true,
            enum: ['Omnivore', 'Vegan', 'Vegitarian'],
        },
        avoid: {
            type: String,
            required: true,
            enum: ['Yes', 'No'],
        },
        restrictions: {
            type: String,
            required: true,
            enum: ['Yes', 'No'],
        },
        allergies: {
            type: [String],
            enum: ['Dairy', 'Nuts', 'Shellfish', 'Gluten', 'Other'],
            default: null
        },
        performanceMeals: {
            type: [String],
            enum: ['preWorkout', 'postWorkout'],
            default: null
        },
    },

    medicalDetails: {
        medicalConditions: {
            type: String,
            required: true,
            enum: ['Yes', 'No'],
        },
        medicationsAffect: {
            type: String,
            required: true,
            enum: ['Yes', 'No'],
        },
        supplements: {
            type: String,
            default: 'No',
            enum: ['Yes', 'No'],
        },
        openToSupplements: {
            type: String,
            default: 'No',
            enum: ['Yes', 'No'],
        },
        notes: { type: String, },
    },

}, { timestamps: true });

module.exports = mongoose.model('Fitness', fitnessSchema);
