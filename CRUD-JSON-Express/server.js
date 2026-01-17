const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

let data = fs.existsSync("./data.json")
  ? JSON.parse(fs.readFileSync("data.json", "utf-8"))
  : [];


app.get("/users", (req, res) => {
  res.json(data);
});


app.get("/users/:id", (req, res) => {
  const user = data.find(u => u.id == req.params.id);
  res.json(user);
});


app.post("/users", (req, res) => {
  const user = {
    id: Date.now(),
    name: req.body.name,
    role: req.body.role
  };

  data.push(user);
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  res.json(user);
});

app.put("/users/:id", (req, res) => {
  const user = data.find(u => u.id == req.params.id);
  user.name = req.body.name;
  user.role = req.body.role;

  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  res.json(user);
});

app.patch("/users/:id", (req, res) => {
  const user = data.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (req.body.name) user.name = req.body.name;
  if (req.body.role) user.role = req.body.role;

  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  res.json(user);
});


app.delete("/users/:id", (req, res) => {
  data = data.filter(u => u.id != req.params.id);
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  res.json({ msg: "deleted" });
});

app.listen(3000, () => console.log("Server started"));


