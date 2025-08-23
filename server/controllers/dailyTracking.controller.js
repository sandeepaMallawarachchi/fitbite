const DailyTracking = require("../models/DailyTracking");

exports.getDailyTracking = async (req, res) => {
  const { userId, date } = req.params;

  try {
    let tracking = await DailyTracking.findOne({ userId, date });
    if (!tracking) {
      return res.json(null);
    }
    res.json(tracking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveDailyTracking = async (req, res) => {
  const { userId, date, totalNutrition, remainingTDEE, originalTDEE, meals } = req.body;

  try {
    let tracking = await DailyTracking.findOneAndUpdate(
      { userId, date },
      { totalNutrition, remainingTDEE, originalTDEE, meals },
      { new: true, upsert: true }
    );
    res.json(tracking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
