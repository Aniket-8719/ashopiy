const cron = require("node-cron");
const {
  checkExpiringSubscriptions,
  checkExpiredSubscriptions,
} = require("./controller/subscriptionController");

const startCronJobs = () => {
  // Schedule `checkExpiringSubscriptions` every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    console.log("Running the expiring subscriptions check...");
    try {
      await checkExpiringSubscriptions();
      console.log("Expiring subscriptions check completed.");
    } catch (error) {
      console.error("Error running expiring subscriptions check:", error.message);
    }
  });

  // Schedule `checkExpiredSubscriptions` every 2 hours
  cron.schedule("0 */1 * * *", async () => {
    console.log("Running the expired subscriptions check...");
    try {
      await checkExpiredSubscriptions();
      console.log("Expired subscriptions check completed.");
    } catch (error) {
      console.error("Error running expired subscriptions check:", error.message);
    }
  });

  // Schedule a cron job to run daily at 12:00 AM IST
cron.schedule("0 18 * * *", async () => {
  const currentTimeIST = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
  console.log(`Cron Job executed at IST time: ${currentTimeIST}`); 

  // Add your scheduled task logic here
}, {
  scheduled: true,
  timezone: "Asia/Kolkata", // Optional but helps in documentation
});
  console.log("Cron jobs have been initialized.");
};

module.exports = startCronJobs;
