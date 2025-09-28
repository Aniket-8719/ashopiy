const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const helmet = require("helmet");

// Import sanitize middleware
const sanitizeAndEscapeMiddleware = require("./middleware/sanitizeInput");

const app = express();

// Enable trust proxy to handle X-Forwarded-For headers (for proper rate limiting)
app.set("trust proxy", true);

// Config file
dotenv.config({ path: "./config/config.env" });

// CORS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Security middleware
app.use(helmet());

// JSON parsing middleware
app.use(express.json()); 
app.use(cookieParser());

// Apply the sanitization and escaping middleware globally
app.use(sanitizeAndEscapeMiddleware);

// Body parser and file upload middleware
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// app.use(
//   express.raw({ type: 'application/json' })
// );


// Routes import
const dailyIncome = require("./routes/incomeRoute");
const investment = require("./routes/investmentRoute");
const userRoute = require("./routes/userRoute");
const udharRoute = require("./routes/udharBookRoute");
const appRoute = require("./routes/appLockRoute");
const subcription = require("./routes/subcriptionRoute");
const onlinePayment = require("./routes/OnlinePaymentRoute");
const ProductCategory  = require("./routes/ProductcategoryRoute");
const startCronJobs = require("./scheduler");

// Registering routes
app.use("/api/v2", dailyIncome);
app.use("/api/v2", investment);
app.use("/api/v2", userRoute);
app.use("/api/v2", udharRoute);
app.use("/api/v2", appRoute);
app.use("/api/v2", subcription);
app.use("/api/v2", onlinePayment);
app.use("/api/v2", ProductCategory);

app.get("/api/v2/getKey", (req,res)=>{
  res.status(200).json({key:process.env.RAZORPAY_API_KEY})
})
 
startCronJobs(); 


// Error middleware
app.use(errorMiddleware);

module.exports = app;
