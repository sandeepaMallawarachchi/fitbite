const cron = require("node-cron");
const User = require("../models/User");

// every minute ("* * * * *") and inactive after 1 min (1000 * 60)
cron.schedule("0 2 * * *", async () => {
  try {
    const users = await User.find();
    const now = new Date();

    for (const user of users) {
      if (user.lastSignedIn) {
        const minutesDiff = Math.floor((now - new Date(user.lastSignedIn)) / (1000 * 60 * 60 * 24));

        if (minutesDiff > 7 && user.status !== "Inactive") {
          user.status = "Inactive";
          await user.save();
        } else if (minutesDiff <= 1 && user.status !== "Active") {
          user.status = "Active";
          await user.save();
        }
      } else {
        console.log(`No lastSignedIn value for ${user.email}`);
      }
    }
  } catch (err) {
    console.error("Cron job failed:", err);
  }
});
