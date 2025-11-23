const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, default: "" },
  amount: { type: String },
  grams: { type: String },
  kcal: { type: Number, default: 0 },
});

const MealSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  kcal: { type: Number, default: 0 },
  items: [ItemSchema],
  macros: {
    carbs: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  },
});

const MealPlanSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"

    totalCalories: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalFat: { type: Number, default: 0 },

    meals: [MealSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealPlan", MealPlanSchema);
