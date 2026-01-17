const http = require("http");
const fs = require("fs");

const PORT = 3000;
const FILE = "./data.json";

function readData() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf-8") || "[]");
}

function writeData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function send(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req,res) => {
  const { method, url } = req;

  if (method === "GET" && url === "/users") {
    return send(res, 200, readData());
  }

  if (method === "GET" && url.startsWith("/users/")) {
    const id = Number(url.split("/").pop());
    const data = readData();
    const user = data.find(u => u.id === id);

    if (!user) return send(res, 404, { message: "User not found" });
    return send(res, 200, user);
  }

  if (method === "POST" && url === "/users") {
    let body = "";

    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const payload = JSON.parse(body);
      const data = readData();

      const newId = data.length ? data[data.length - 1].id + 1 : 1;

      const newUser = {
        id: newId,
        name: payload.name,
        role: payload.role
      };

      data.push(newUser);
      writeData(data);

      return send(res, 201, newUser);
    });
    return;
  }

  if (method === "PUT" && url.startsWith("/users/")) {
    const id = Number(url.split("/").pop());
    let body = "";

    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const payload = JSON.parse(body);
      const data = readData();
      const index = data.findIndex(u => u.id === id);

      if (index === -1)
        return send(res, 404, { message: "User not found" });

      const updatedUser = {
        id: data[index].id,
        name: payload.name ?? data[index].name,
        role: payload.role ?? data[index].role
      };

      data[index] = updatedUser;
      writeData(data);

      return send(res, 200, updatedUser);
    });
    return;
  }

  if (method === "PATCH" && url.startsWith("/users/")) {
    const id = Number(url.split("/").pop());
    let body = "";

    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const payload = JSON.parse(body);
      const data = readData();
      const index = data.findIndex(u => u.id === id);

      if (index === -1) return send(res, 404, { message: "User not found" });

      if (payload.name !== undefined) data[index].name = payload.name;
      if (payload.role !== undefined) data[index].role = payload.role;

      writeData(data);
      return send(res, 200, data[index]);
    });
    return;
  }

  if (method === "DELETE" && url.startsWith("/users/")) {
    const id = Number(url.split("/").pop());
    const data = readData();
    const filtered = data.filter(u => u.id !== id);

    if (data.length === filtered.length)
      return send(res, 404, { message: "User not found" });

    writeData(filtered);
    return send(res, 200, { message: "User deleted" });
  }

  send(res, 404, { message: "Route not found" });
});


server.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

