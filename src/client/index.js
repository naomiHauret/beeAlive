import styles from "./styles/main.css"
import io from "socket.io-client"
import { SERVER_PORT } from "./../shared/config"

const socket = io.connect(`http://localhost:${SERVER_PORT}`);

socket.on("news", (data) => {
  console.log(data)
  socket.emit("other event", {my: "data"})
})
console.log("hello world (from client)")
