const MealPlan = require("../models/MealPlan");

// GET meal plan for a user
exports.getMealPlan = async (req, res) => {
  const { userId } = req.params;
  try {
    const plan = await MealPlan.findOne({ userId }).sort({ createdAt: -1 });
    if (!plan) {
      return res.json(null);
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE meal plan
exports.createMealPlan = async (req, res) => {
  try {
    const plan = new MealPlan(req.body);
    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE meal plan (whole document)
exports.updateMealPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await MealPlan.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
