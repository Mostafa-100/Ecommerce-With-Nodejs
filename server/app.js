const express = require("express");
const app = express();

require("dotenv").config();

const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const { registerValidator } = require("./validators/userValidator");

app.use(express.json());

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    app.listen(3000, () => console.log("Server is running"));
  })
  .catch((error) => {
    console.log("Error in connecting: ", error);
  });

app.post("/api/register", registerValidator, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(419).json({ errors: errors.array() });
  }

  return res.json({ message: "Very good" });
});
