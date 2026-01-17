const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const Joi = require("joi");
const yup = require("yup");
const { z } = require("zod");
const { body, validationResult } = require("express-validator");
const Ajv = require("ajv");

const app = express();
app.use(express.json());

const sequelize = new Sequelize("testdb", "root", "password", {
  dialect: "mysql",
});

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
});

const joiSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
});

app.post("/joi/user", async (req, res) => {
  const { error } = joiSchema.validate(req.body);
  if (error) return res.status(400).json(error.message);

  const user = await User.create(req.body);
  res.json(user);
});

const yupSchema = yup.object({
  name: yup.string().min(3).required(),
  email: yup.string().email().required(),
});

app.post("/yup/user", async (req, res) => {
  try {
    await yupSchema.validate(req.body);
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

const zodSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

app.post("/zod/user", async (req, res) => {
  const result = zodSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json(result.error.errors);

  const user = await User.create(result.data);
  res.json(user);
});

app.post(
  "/express-validator/user",
  body("name").isLength({ min: 3 }),
  body("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json(errors.array());

    const user = await User.create(req.body);
    res.json(user);
  }
);

const ajv = new Ajv();
const ajvSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3 },
    email: { type: "string", format: "email" },
  },
  required: ["name", "email"],
};

const validateAjv = ajv.compile(ajvSchema);

app.post("/ajv/user", async (req, res) => {
  const valid = validateAjv(req.body);
  if (!valid) return res.status(400).json(validateAjv.errors);

  const user = await User.create(req.body);
  res.json(user);
});

app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

(async () => {
  await sequelize.sync();
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
})();
