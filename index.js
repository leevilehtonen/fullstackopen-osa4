const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");

app.use(cors());
app.use(bodyParser.json());
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

const mongoUrl = "";
mongoose.connect(mongoUrl);

const PORT = 3003;
const server = http.createServer(app);

if (!module.parent) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

server.on("close", () => {
  mongoose.connection.close();
});

module.exports = {
  app,
  server
};
