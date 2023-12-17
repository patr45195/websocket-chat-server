const express = require("express");
const app = express();
const PORT = 5000;

const http = require("http").Server(app);
const cors = require("cors");
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.get("api", (req, res) => {
  res.json({
    message: "Hello",
  });
});

let users = [];

socketIO.on("connection", (socket) => {
  console.log(`User connected with socketID = ${socket.id}`);

  socket.on("message", (data) => {
    socketIO.emit("response", data);
  });

  socket.on("typing", (data) => socket.broadcast.emit("responseTyping", data));

  socket.on("newUser", (data) => {
    users.push(data);
    socketIO.emit("responseNewUser", users);
    console.log(users)
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected.`);
    users = users.filter(item => item.socketID !== socket.id);
    console.log('users: ', users)
  });
});

http.listen(PORT, () => {
  console.log(`Server working on port: ${PORT}`);
});
