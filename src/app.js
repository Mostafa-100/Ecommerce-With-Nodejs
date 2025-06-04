const express = require("express");
const app = express();

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
