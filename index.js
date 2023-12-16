const express = require("express");
const app = express();
const PORT = 5000;

app.get("api", (req, res) => {
  res.json({
    message: "Hello",
  });
});

app.listen(PORT, () => {
    console.log(`Server working on port: ${PORT}`)
})
