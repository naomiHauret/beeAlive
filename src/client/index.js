import styles from "./styles/main.css";
import domready from "domready";
import io from "socket.io-client";
import swal from "sweetalert2";
import { SERVER_PORT } from "./../shared/config";
import Bee from "./js/Bee";
import Scene from "./js/Scene";
import "whatwg-fetch";

const loadingScreen = document.querySelector('[data-flag="loadingScreen"]');
const socket = io.connect(`http://localhost:${SERVER_PORT}`);
const ip = "192.168.0.16";
const mongo = "http://" + ip + ":3000/";

socket.on("news", data => {
  console.log(data);
  socket.emit("other event", { my: "data" });
});

domready(() => {
  const add_bee = document.querySelector("#send-bee");
  const compteur = document.querySelector("#number");
  let ourScene = "";

  getBees(ourScene, compteur, add_bee, "new");
  setTimeout(() => {
    loadingScreen.classList.add("is-done");
    setTimeout(() => {
      document.body.removeChild(loadingScreen);
    }, 900);
  }, 3500);
});

const getBees = (ourScene, compteur, add_bee, trigger) => {
  fetch(mongo + "findAll")
    .then(response => response.json())
    .then(response => {
      let nb_bees = response.length ? response.length : 0;

      if (trigger === "new") {
        ourScene = new Scene(false, false, nb_bees);

        add_bee.addEventListener("click", () => {
          swal({
            title: "Do you want to send a bee ?",
            text: "You can attach a message and write your name !",
            html:
              '<p class="label">Author :</p><input id="author" class="swal2-input" type="text" placeholder="Your author name" /><p class="label">Message :</p><input id="message" class="swal2-input type="text" placeholder="Your message here" />',
            showCancelButton: true,
            confirmButtonText: "Yes, of course !",
            cancelButtonText: "No, thx I keep watchin'"
          }).then(result => {
            let author = document.querySelector("#author"),
              message = document.querySelector("#message");

            if (
              result.value &&
              author.value.length > 0 &&
              message.value.length > 0
            ) {
              fetch(
                mongo +
                  "create?author=" +
                  author.value +
                  "&message=" +
                  message.value
              )
                .then(response => response.json())
                .then(response => {
                  ourScene.addBee(
                    new Bee(
                      ourScene.getRenderer(),
                      ourScene.getCamera(),
                      ourScene.getScene()
                    )
                  );
                  getBees(ourScene, compteur, false, false);
                });
            } else if (
              result.value &&
              author.value.length < 1 &&
              message.value.length < 1
            ) {
              swal(
                "Error",
                "Hey deep shit, write your name and a message before sending a bee !!!",
                "error"
              );
            }
          });
        });
      }

      ourScene.setNumber(nb_bees);
      compteur.innerText = nb_bees;
    });
};
