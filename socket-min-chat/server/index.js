const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("users", Object.values(users));
  });

  socket.on("message", (data) => {
    io.emit("message", {
      user: users[socket.id],
      text: data,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", Object.values(users));
  });
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
