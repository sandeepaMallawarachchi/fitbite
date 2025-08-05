const connectDB = require("../database/dbConnection");
const updateUserStatus = require("./updateUserStatus");

module.exports = async (req, res) => {
  try {
    await connectDB();
    await updateUserStatus();
    return res.status(200).json({ message: "User status updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Cron job failed" });
  }
};
