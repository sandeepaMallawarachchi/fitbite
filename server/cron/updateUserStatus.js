const cron = require("node-cron");
const User = require("../models/User");

cron.schedule("* * * * *", async () => {
  try {
    const users = await User.find();
    const now = new Date();

    for (const user of users) {
      if (user.lastSignedIn) {
        const minutesDiff = Math.floor((now - new Date(user.lastSignedIn)) / (1000 * 60));

        console.log(`User: ${user.email}`);
        console.log(`  Last Signed In: ${new Date(user.lastSignedIn).toLocaleString()}`);
        console.log(`  Now: ${now.toLocaleString()}`);
        console.log(`  Diff: ${minutesDiff} minutes`);
        console.log(`  Current Status: ${user.status}`);

        if (minutesDiff > 1 && user.status !== "Inactive") {
          user.status = "Inactive";
          await user.save();
          console.log(`Changed status to Inactive`);
        } else if (minutesDiff <= 1 && user.status !== "Active") {
          user.status = "Active";
          await user.save();
          console.log(`Changed status to Active`);
        } else {
          console.log("No status change needed");
        }
      } else {
        console.log(`No lastSignedIn value for ${user.email}`);
      }
    }

    console.log("Cron finished");
  } catch (err) {
    console.error("Cron job failed:", err);
  }
});
