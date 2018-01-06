import styles from "./styles/main.css"
import io from "socket.io-client"
import { SERVER_PORT } from "./../shared/config"
import Scene from "./js/Scene"

const socket = io.connect(`http://localhost:${SERVER_PORT}`)

socket.on("news", (data) => {
  console.log(data)
  socket.emit("other event", {my: "data"})
})

const ourScene = new Scene(false, false)
