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

async function setupDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100)
    )
  `);

  
  await db.query(`DROP PROCEDURE IF EXISTS sp_add_user`);
  await db.query(`DROP PROCEDURE IF EXISTS sp_get_users`);
  await db.query(`DROP PROCEDURE IF EXISTS sp_get_user_by_id`);
  await db.query(`DROP PROCEDURE IF EXISTS sp_delete_user`);
  await db.query(`DROP PROCEDURE IF EXISTS sp_update_user`);
  await db.query(`DROP PROCEDURE IF EXISTS sp_user_count`);

  await db.query(`
    CREATE PROCEDURE sp_add_user(IN p_name VARCHAR(100), IN p_email VARCHAR(100))
    BEGIN
      INSERT INTO users(name, email) VALUES (p_name, p_email);
    END
  `);

  await db.query(`
    CREATE PROCEDURE sp_get_users()
    BEGIN
      SELECT * FROM users;
    END
  `);

  await db.query(`
    CREATE PROCEDURE sp_get_user_by_id(IN p_id INT)
    BEGIN
      SELECT * FROM users WHERE id = p_id;
    END
  `);

  await db.query(`
    CREATE PROCEDURE sp_delete_user(IN p_id INT)
    BEGIN
      DELETE FROM users WHERE id = p_id;
    END
  `);

  await db.query(`
    CREATE PROCEDURE sp_update_user(
      IN p_id INT,
      IN p_name VARCHAR(100),
      IN p_email VARCHAR(100)
    )
    BEGIN
      UPDATE users SET name = p_name, email = p_email WHERE id = p_id;
    END
  `);

  await db.query(`
    CREATE PROCEDURE sp_user_count(OUT total INT)
    BEGIN
      SELECT COUNT(*) INTO total FROM users;
    END
  `);

  console.log(" Table & Stored Procedures Ready");
}

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  await db.execute("CALL sp_add_user(?, ?)", [name, email]);
  res.send("User added");
});

app.get("/users", async (req, res) => {
  const [rows] = await db.execute("CALL sp_get_users()");
  res.json(rows[0]);
});

app.get("/users/:id", async (req, res) => {
  const [rows] = await db.execute(
    "CALL sp_get_user_by_id(?)",
    [req.params.id]
  );
  res.json(rows[0][0]);
});

app.delete("/users/:id", async (req, res) => {
  await db.execute("CALL sp_delete_user(?)", [req.params.id]);
  res.send("User deleted");
});


app.put("/users/:id", async (req, res) => {
  const { name, email } = req.body;
  await db.execute(
    "CALL sp_update_user(?, ?, ?)",
    [req.params.id, name, email]
  );
  res.send("User updated");
});

app.get("/users-count", async (req, res) => {
  await db.execute("CALL sp_user_count(@total)");
  const [result] = await db.execute("SELECT @total AS count");
  res.json(result[0]);
});


app.listen(3000, async () => {
  await setupDatabase();
  console.log(" Server running on port 3000");
});

