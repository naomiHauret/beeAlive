import { SERVER_PORT, CLIENT_PORT } from "./../shared/config";

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const beeSchema = new Schema({
  id: String,
  author: String,
  message: String
});
const Bee = mongoose.model("Bee", beeSchema);

mongoose.connect('mongodb://localhost:27017/beealive');
Bee.find((error, result) => {
if(error) {
console.log('ERROR', error);
} else {
console.log('RESULT', result);
}
});

app.use(express.static("dist"));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

server.listen(SERVER_PORT, () => {
  console.log(`Server servin' from good ol' port ${SERVER_PORT}`);
  console.log(`Client listenin' on port ${CLIENT_PORT}`);
});

io.on("connection", (socket) => {
  socket.emit("news", {hello: "world"});
  socket.on("other event", data => console.log);
});
