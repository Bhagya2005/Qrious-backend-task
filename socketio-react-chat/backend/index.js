const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Room data
let rooms = {
  "team-1": [],
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ username, room }) => {
    socket.username = username;
    socket.room = room;
    socket.join(room);

    // Add user to room
    rooms[room].push({ id: socket.id, username });

    // Notify everyone in room
    io.to(room).emit("newMessage", {
      user: "System",
      message: `${username} joined the chat`,
    });

    // Send updated online users list
    io.to(room).emit("onlineUsers", rooms[room].map((u) => u.username));
  });

  socket.on("sendMessage", (message, callback) => {
    io.to(socket.room).emit("newMessage", {
      user: socket.username,
      message,
    });
    callback({ status: "delivered" });
  });

  socket.on("typing", () => {
    socket.to(socket.room).emit("typing", socket.username);
  });

  socket.on("disconnect", () => {
    if (socket.room) {
      // Remove from room
      rooms[socket.room] = rooms[socket.room].filter((u) => u.id !== socket.id);

      io.to(socket.room).emit("newMessage", {
        user: "System",
        message: `${socket.username} left the chat`,
      });

      io.to(socket.room).emit("onlineUsers", rooms[socket.room].map((u) => u.username));
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
