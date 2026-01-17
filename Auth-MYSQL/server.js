require("dotenv").config();
const express = require("express");
const sequelize = require("./config/db");

const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log("DB error:", err));
