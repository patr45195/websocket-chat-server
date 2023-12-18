const express = require("express");
const app = express();
const PORT = 5000;

const http = require("http").Server(app);

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
let usersMessages = [];
let typingTimer = {};

socketIO.on("connection", (socket) => {
  socketIO.emit("response", usersMessages);

  socket.on("message", (userMessage) => {
    usersMessages.push(userMessage);
    socketIO.emit("response", usersMessages);
  });

  socket.on("typing", (data) => {
    if (!typingTimer[socket.id]) {
      typingTimer[socket.id] = setTimeout(() => {
        delete typingTimer[socket.id];
      }, 3000);
      socket.broadcast.emit("responseTyping", data);
    }
  });

  socket.on("newUser", (data) => {
    users.push(data);
    socketIO.emit("usersChange", users);
  });

  socket.on("clearChat", () => {
    usersMessages = [];
    socketIO.emit("response", usersMessages);
  });

  socket.on("disconnect", () => {
    users = users.filter((item) => item.socketID !== socket.id);
    if (users.length === 0) {
      usersMessages = [];
    }
    socketIO.emit("usersChange", users);
  });
});

http.listen(PORT, () => {
  console.log(`Server working on port: ${PORT}`);
});
