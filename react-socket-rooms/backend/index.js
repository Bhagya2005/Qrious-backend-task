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

// NAMESPACE :  only clients connected to /chat can chat

const chatNamespace = io.of("/chat");

chatNamespace.on("connection", (socket) => {
  console.log("Connected to /chat:", socket.id);

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;

    socket.to(room).emit("message", {
      user: "System",
      text: `${username} joined ${room}`,
    });
  });

  socket.on("sendMessage", (message) => {
    chatNamespace.to(socket.room).emit("message", {
      user: socket.username,
      text: message,
    });
  });

  socket.on("disconnect", () => {
    if (socket.room) {
      socket.to(socket.room).emit("message", {
        user: "System",
        text: `${socket.username} left`,
      });
    }
  });
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
