const express = require("express");
const app = express();

const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
// const cors = require("cors");

const customErrorHandler = require("./middlewares/customErrorHandler");

const globalLimiter = require("./utils/globalLimiter");

app.set("view engine", "ejs");
app.set("views", "/emails");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use(globalLimiter);
app.use(helmet());
app.use(compression());
app.use(cookieParser());
// app.use(cors({ origin: process.env.FRONTEND_URL }));

app.use(express.json());

app.use("/", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", paymentRoutes);

app.use(customErrorHandler);

module.exports = app;
