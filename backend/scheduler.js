const cron = require("node-cron");
const {
  checkExpiringSubscriptions,
  checkExpiredSubscriptions,
} = require("./controller/subscriptionController");

const startCronJobs = () => {
  // Schedule `checkExpiringSubscriptions` every 12 hours
  cron.schedule("0 */6 * * *", async () => {
    console.log("Running the expiring subscriptions check...");
    try {
      await checkExpiringSubscriptions();
      console.log("Expiring subscriptions check completed.");
    } catch (error) {
      console.error("Error running expiring subscriptions check:", error.message);
    }
  });

  // Schedule `checkExpiredSubscriptions` every 6 hours
  cron.schedule("0 */2 * * *", async () => {
    console.log("Running the expired subscriptions check...");
    try {
      await checkExpiredSubscriptions();
      console.log("Expired subscriptions check completed.");
    } catch (error) {
      console.error("Error running expired subscriptions check:", error.message);
    }
  });

  console.log("Cron jobs have been initialized.");
};

module.exports = startCronJobs;
