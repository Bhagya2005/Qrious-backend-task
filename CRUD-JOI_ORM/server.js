const express = require("express");
const Joi = require("joi");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(express.json());


const sequelize = new Sequelize("testdb", "root", "Bhagya@012026", {
  dialect: "mysql",
});

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
});



const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
});


app.post("/users", async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.create(req.body);
  res.status(201).json(user);
});

app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.put("/users/:id", async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.update(req.body);
  res.json(user);
});

app.delete("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.destroy();
  res.json({ message: "User deleted" });
});

(async () => {
  await sequelize.sync();
  app.listen(3000, () => console.log("Server running on port 3000"));
})();
