const cron = require("node-cron");
const {
  checkExpiringSubscriptions,
  checkExpiredSubscriptions,
} = require("./controller/subscriptionController");
const { dummyFunction } = require("./controller/incomeController");

const startCronJobs = () => {
  // Schedule `checkExpiringSubscriptions` every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    console.log("Running the expiring subscriptions check...");
    try {
      await checkExpiringSubscriptions();
      console.log("Expiring subscriptions check completed.");
    } catch (error) {
      console.error(
        "Error running expiring subscriptions check:",
        error.message
      );
    }
  });

  // Schedule `checkExpiredSubscriptions` every 2 hours
  cron.schedule("0 */1 * * *", async () => {
    console.log("Running the expired subscriptions check...");
    try {
      await checkExpiredSubscriptions();
      console.log("Expired subscriptions check completed.");
    } catch (error) {
      console.error(
        "Error running expired subscriptions check:",
        error.message
      );
    }
  });

  // Schedule a cron job to run daily at 12:00 AM IST
  cron.schedule(
   "28 0 * * *",
    async () => {
      const currentTimeIST = moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");
      console.log(`✅ Cron Job executed at IST time: ${currentTimeIST}`);

      try { 
        await dummyFunction(); // call your dummy function here
      } catch (error) {
        console.error("Error running dummy function:", error.message);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );

  console.log("Cron jobs have been initialized.");
};

module.exports = startCronJobs;
