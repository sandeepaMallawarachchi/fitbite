// cron/updateUserStatus.js
const User = require("../models/User");

const updateUserStatus = async () => {
  try {
    const users = await User.find();
    const now = new Date();

    for (const user of users) {
      if (user.lastSignedIn) {
        const daysDiff = Math.floor((now - new Date(user.lastSignedIn)) / (1000 * 60 * 60 * 24));

        if (daysDiff > 7 && user.status !== "Inactive") {
          user.status = "Inactive";
          await user.save();
        } else if (daysDiff <= 1 && user.status !== "Active") {
          user.status = "Active";
          await user.save();
        }
      } else {
        console.log(`No lastSignedIn value for ${user.email}`);
      }
    }

    console.log("User status updated.");
  } catch (err) {
    console.error("Cron job failed:", err);
  }
};

module.exports = updateUserStatus;