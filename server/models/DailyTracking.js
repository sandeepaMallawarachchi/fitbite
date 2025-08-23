const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
  calories: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
});

const mealSchema = new mongoose.Schema({
  id: { type: String, required: true },
  content: { type: String, required: true },
  nutrition: { type: nutritionSchema, required: true },
  timestamp: { type: Date, default: Date.now }
});

const dailyTrackingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  totalNutrition: { type: nutritionSchema, default: () => ({}) },
  remainingTDEE: { type: Number, default: 0 },
  originalTDEE: { type: Number, default: 0 },
  meals: [mealSchema]
}, { timestamps: true });

dailyTrackingSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailyTracking", dailyTrackingSchema);
