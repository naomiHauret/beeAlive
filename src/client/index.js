import styles from "./styles/main.css";
import domready from "domready";
import io from "socket.io-client";
import swal from "sweetalert2";
import { SERVER_PORT } from "./../shared/config";
import Bee from "./js/Bee";
import Scene from "./js/Scene";
import "whatwg-fetch";

const loadingScreen = document.querySelector('[data-flag="loadingScreen"]');
const ip = "192.168.0.18";
const url = `http://`+ ip +`:${SERVER_PORT}`
const socket = io(url);
const mongo = url +'/';
const range = document.querySelector('[data-flag="beeRange"]');

socket.on("newBee", (data) => {
  let ourScene = new Scene(false, false, data.compteur);

  ourScene.addBee(
    new Bee(
      ourScene.getRenderer(),
      ourScene.getCamera(),
      ourScene.getScene()
    )
  );
  getBees(ourScene, document.querySelector("#number"), false, false);
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

                  socket.emit("addBee", { ourScene: ourScene, compteur: compteur });
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
        ["input", "change"].forEach(event => {
          range.addEventListener(event, ()=> {
            let nb_bees = range.value;
            let prev_number = ourScene.getNumber();
            if(nb_bees > prev_number) {
              let nb_to_add = nb_bees - prev_number;
              for(let i = 0; i < nb_to_add ; i++) {
                ourScene.addBee(
                  new Bee(
                    ourScene.getRenderer(),
                    ourScene.getCamera(),
                    ourScene.getScene()
                  )
                );
              }
            } else {
              let nb_to_remove = prev_number - nb_bees;
              ourScene.removeBeesFromHive(nb_to_remove);
            }
            ourScene.setNumber(nb_bees);
            compteur.innerText = nb_bees;
            })
        })
      }

      ourScene.setNumber(nb_bees);
      compteur.innerText = nb_bees;
      range.value = nb_bees;
    });
};
