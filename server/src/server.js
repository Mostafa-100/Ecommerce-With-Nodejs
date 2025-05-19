require("dotenv").config();

const app = require("./app");

const connectDb = require("./config/db");

connectDb().then(() => {
  app.listen(process.env.API_PORT, () => console.log("Server is running"));
});
