const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const cors = require("cors");

const app = express();

// config file
dotenv.config({path:"./config/config.env"});

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.FRONTEND_URL];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes import
const dailyIncome = require("./routes/incomeRoute");
const investment = require("./routes/investmentRoute");
app.use("/api/v2", dailyIncome);
app.use("/api/v2", investment);

//  use Middleware
app.use(errorMiddleware);

module.exports = app;
