const mongoose = require("mongoose");

const connetDatabase = () => {
  mongoose
    .connect(process.env.MONGODB_URL) 
    .then((data) => { 
      console.log(`Database connected successfully: ${data.connection.host}`);
    })  
    .catch((err) => {
      console.log(`Error connecting to MongoDB: ${err.message}`);
      process.exit(1);
    });
};

module.exports = connetDatabase;
