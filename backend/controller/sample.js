// const generateUniqueShopkeeperId = async () => {
//     let unique = false;
//     let shopkeeperId;
  
//     while (!unique) {
//       shopkeeperId = "SHP-" + Math.floor(100000 + Math.random() * 900000); // Generate 6-digit random number
//       const exists = await ShopkeeperModel.findOne({ shopkeeperId }); // Check in the database
//       if (!exists) unique = true; // If no conflict, mark as unique
//     }
  
//     return shopkeeperId;
//   };
  
//   // Usage Example
//   const createShopkeeper = async (req, res) => {
//     try {
//       const shopkeeperId = await generateUniqueShopkeeperId(); // Ensure unique ID
//       const newShopkeeper = new ShopkeeperModel({
//         name: req.body.name,
//         email: req.body.email,
//         shopkeeperId: shopkeeperId, // Assign unique shopkeeperId
//       });
  
//       await newShopkeeper.save();
//       res.status(201).json({ message: "Shopkeeper created successfully", shopkeeperId });
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error });
//     }
//   };
const moment = require("moment-timezone");
  
// // Get the current UTC time
// const currentUTC = moment.utc();

// // Add 5 hours and 30 minutes to convert to IST
// const indiaDateTimeManual = currentUTC.clone().add(5, "hours").add(30, "minutes");

// // Print the results
// console.log("UTC Time:", currentUTC.format());
// console.log("India DateTime (Manual Addition):", indiaDateTimeManual.format());

// console.log("testing chalu h");

// // Get the current date and time in the Asia/Kolkata timezone
//       const indiaDateTime = moment.tz("Asia/Kolkata");
      
//       // Add 5 hours and 30 minutes to adjust to UTC
//       const utcDateTime = indiaDateTime.clone().add(5, "hours").add(30, "minutes").toDate();

        // const currentDate = moment().utc().add(5, "hours").add(30, "minutes");
//           const currentUTC = moment.utc();
              
//               // Add 5 hours and 30 minutes to convert to IST
//           const indiaDateTimeManual = currentUTC.clone().add(5, "hours").add(30, "minutes");
// // Print the results
// console.log("current Time:", currentUTC);
// console.log("indian Time:", indiaDateTimeManual.toDate());
// console.log("three:", threeDaysAhead);

// const currentDate = moment().utc().add(5, "hours").add(30, "minutes");

// console.log("current Time:", currentDate.toDate());
// // console.log("buy subscription: ", threeDaysAhead.toDate());

// const currentDate = moment().utc().add(5, "hours").add(30, "minutes");
// const threeDaysAhead = moment(currentDate).add(3, "days");

// console.log("current Time:", currentDate.toDate());
// console.log("buy subscription: ", threeDaysAhead.toDate());

   const currentDate = moment().utc().add(5, "hours").add(30, "minutes");
   console.log("current Time:", currentDate.toDate());


