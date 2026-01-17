const express = require("express");
const sequelize = require("./config/db");
const userRoutes = require("./routes/user.routes");

const app = express();
app.use(express.json());

app.use("", userRoutes);


sequelize.sync()
  .then(() => console.log("Database connected & synced"))
  .catch(err => console.log(err));

module.exports = app;
