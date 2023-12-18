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
let typingTimer = {};

socketIO.on("connection", (socket) => {
  socket.on("message", (userMessage) => {
    socketIO.emit("response", userMessage);
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

  socket.on("disconnect", () => {
    users = users.filter((item) => item.socketID !== socket.id);
    socketIO.emit("usersChange", users);
  });
});

http.listen(PORT, () => {
  console.log(`Server working on port: ${PORT}`);
});
