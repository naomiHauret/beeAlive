import { SERVER_PORT, CLIENT_PORT } from "./../shared/config";

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const beeSchema = new Schema({
  id: Object,
  author: String,
  message: String
});
const Bee = mongoose.model("Bee", beeSchema);

mongoose.connect("mongodb://localhost:27017/beealive");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static("dist"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/findAll", (req, res) => {
  Bee.find((error, result) => {
    if (error) {
      res.send(error);
    } else {
      result.length < 1 ? res.send({"message": "Aucuns résultats"}) : res.send(result);
    }
  });
});

app.get("/findOne", (req, res) => {
  Bee.find({
    "_id": req.query._id
  }, (error, result) => {
    if (error) {
      res.send(error);
    } else {
      result.length < 1 ? res.send({"message": "Aucun résultat"}) : res.send(result);
    }
  });
});

app.get("/create", (req, res) => {
  Bee.create({
    "author": req.query.author,
    "message": req.query.message
  }, (error, result) => {
    error ? res.send(error) : res.send(result);
  });
});

server.listen(SERVER_PORT, () => {
  console.log(`Server servin' from good ol' port ${SERVER_PORT}`);
  console.log(`Client listenin' on port ${CLIENT_PORT}`);
  console.log('Don\'t forget to change your IP in client/index.js to get stuff running !' );
});

io.on("connection", (socket) => {
  socket.on("addBee", (data) => {
    Bee.find({
      "_id": data._id
    }, (error, result) => {
      if (error) {
        res.send(error);
      } else {
        result.length < 1 ? res.send({"message": "Aucuns résultats"}) : io.emit("newBee", { bees: result });
      }
    });
  });
});
