const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const data = await mongoose.connect(process.env.MONGODB_URL, {
    });
    console.log(`Database connected successfully: ${data.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1); // Exit the process with failure code if the connection fails
  }
};

module.exports = connectDatabase;
