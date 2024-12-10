const app = require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const connectDatabase = require("./config/database");


// Handling Uncought Exception ---> when you declare irrelevant console.log(youtube);
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to uncaught Exception `);
    process.exit(1);
});

// config file
dotenv.config({path:"./config/config.env"});

// Database
connectDatabase();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

 
// server is running
const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
   
});
  
//  Unhandled Promise Rejection --> when you forget something like  "mongodb" =  mongod"
process.on("unhandledRejection", (err)=>{
    console.log(`Error ${err.message}`);
    console.log("shutting down the server due to unhandled Promise Rejection");
    server.close(()=>{
        process.exit(1);
    })
})
