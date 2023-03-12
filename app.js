const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const path = require("path");

const indexRoutes = require("./routers/indexRoutes");
const userRoutes = require('./routers/userRoutes');

const { logError, returnError } = require("./middlewares/handleErrors");

//utils
const ApiError = require("./utils/ApiError");

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());

// set security http headers
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// $ CORS
app.use(cors());

//  set limit request from same API in timePeroid from same ip
const limiter = rateLimit({
  max: 100, //   max number of limits
  windowMs: 60 * 60 * 1000, // hour
  message: " Too many req from this IP , please Try  again in an Hour ! ",
});

app.use("/api", limiter);

//  Body Parser  => reading data from body into req.body protect from scraping etc
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSql query injection
app.use(mongoSanitize()); //   filter out the dollar signs protect from  query injection attact

// Data sanitization against XSS
app.use(xss()); //    protect from molision code coming from html

// routes
app.use("/api/v1", indexRoutes);
app.use("/api/v1", userRoutes);

// handling all (get,post,update,delete.....) unhandled routes
app.use("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on the server`, 404));
});
app.use(logError);
app.use(returnError);

module.exports = app;
