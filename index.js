const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://client-rho-sandy.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (room, username) => {
    socket.join(room);
    socket.to(room).emit("receive_message", {
      room: room,
      username: username,
      message: username + " has joined the room",
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    });
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
