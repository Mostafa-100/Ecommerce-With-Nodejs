const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const customErrorHandler = require("./middlewares/customErrorHandler");

app.set("view engine", "ejs");
app.set("views", "/emails");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

app.use(limiter);
app.use(helmet());

app.use(express.json());

app.use("/", authRoutes);
app.use("/api/v1", productRoutes);

app.use(customErrorHandler);

module.exports = app;
