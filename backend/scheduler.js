const cron = require("node-cron");
const {
  checkExpiringSubscriptions,
  checkExpiredSubscriptions,
} = require("./controller/subscriptionController");

const startCronJobs = () => {
  cron.schedule("30 18 * * *", async () => {
    console.log("Running the subscription check...");
    try {
      await checkExpiringSubscriptions(); // Test expiring subscriptions
      await checkExpiredSubscriptions();  // Test expired subscriptions
      console.log("good");
    } catch (error) {
      console.error("Error running subscription check:", error.message);
    }
  });

  console.log("Cron jobs have been initialized.");
};

module.exports = startCronJobs;
