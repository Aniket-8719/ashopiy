const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const helmet = require("helmet");

// Import sanitize middleware
const sanitizeInputMiddleware = require("./middleware/sanitizeInput");

const app = express();

// Enable trust proxy to handle X-Forwarded-For headers (for proper rate limiting)
app.set('trust proxy', true);


// config file
dotenv.config({path:"./config/config.env"});

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(helmet());
app.use(express.json()); 
app.use(cookieParser());

// Apply the sanitization middleware globally
app.use(sanitizeInputMiddleware);

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);


// Routes import
const dailyIncome = require("./routes/incomeRoute");
const investment = require("./routes/investmentRoute");
const userRoute = require("./routes/userRoute");
app.use("/api/v2", dailyIncome);
app.use("/api/v2", investment);
app.use("/api/v2", userRoute);

//  use Middleware
app.use(errorMiddleware);

module.exports = app;
