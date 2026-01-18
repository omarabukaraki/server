const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

let io;

if (!io) {
  io = new Server(server, {
    cors: {
      origin: "https://client-rho-sandy.vercel.app",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected:", socket.id);

    socket.on("join_room", (room) => {
      socket.join(room);
    });

    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

module.exports = (req, res) => {
  if (!res.socket.server.io) {
    res.socket.server.io = io;
  }
  res.end();
};
