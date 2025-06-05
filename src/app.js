const express = require("express");
const app = express();

const customErrorHandler = require("./middlewares/customErrorHandler");

app.set("view engine", "ejs");
app.set("views", "/emails");

const authRoutes = require("./routes/authRoutes");

app.use(express.json());

app.use("/", authRoutes);

app.use(customErrorHandler);

module.exports = app;
