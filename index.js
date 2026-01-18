const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

let io;

module.exports = (req, res) => {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "https://client-rho-sandy.vercel.app",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("connected:", socket.id);

      socket.on("join_room", (room) => {
        socket.join(room);
      });

      socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
      });

      socket.on("disconnect", () => {
        console.log("disconnected:", socket.id);
      });
    });
  }

  res.end();
};
