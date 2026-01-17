const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());  

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Bhagya@012026",
  database: "users_db",
});

async function createTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100)
    )
  `);
  console.log("Table ready");
}

app.post("/users", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;

  await db.execute(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email]
  );

  res.send("User added");
});

app.get("/users", async (req, res) => {
  const [data] = await db.execute("SELECT * FROM users");
  res.json(data);
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  const [data] = await db.execute(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );

  res.json(data[0]);
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;

  await db.execute(
    "DELETE FROM users WHERE id=?",
    [id]
  );

  res.send("User deleted");
});

app.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const email = req.body.email;

  await db.execute(
    "UPDATE users SET name=?, email=? WHERE id=?",
    [name, email, id]
  );

  res.send("User updated");
});

app.patch("/users/:id", async (req,res) =>{
  const id = req.params.id;
  let query = "UPDATE users SET ";
  let params = [];

  if (req.body.name) {
    query += "name = ?, ";
    params.push(req.body.name);
  }
  if (req.body.email) {
    query += "email = ?, ";
    params.push(req.body.email);
  }

  if (params.length === 0) {
    return res.status(400).send("No fields to update");
  }

  query = query.slice(0, -2); 
  query += " WHERE id = ?";
  params.push(id);

  await db.execute(query, params);
  res.send("User updated");
})

app.listen(3000, async () => {
  await createTable();
  console.log("Server running on port 3000");
});
