const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set("views", "/emails");

const authRoutes = require("./routes/authRoutes");

app.use(express.json());

app.use("/", authRoutes);

app.use((err, req, res) => {
  console.error(err.message);
  res.status(500).json({
    error: err.message,
  });
});

module.exports = app;
