import styles from "./styles/main.css";
import toastr_styles from "../../node_modules/toastr/build/toastr.css";
import domready from "domready";
import io from "socket.io-client";
import swal from "sweetalert2";
import toastr from "toastr";
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
const add_bee = document.querySelector("#send-bee");
const modeTogglers = document.querySelectorAll('[data-flag="modeToggler"]');
const compteur = document.querySelector("#number");
const aboutTrigger = document.querySelector('[data-flag="triggerExplanations"]')

range.classList.add("is-hidden");

domready(() => {
  let ourScene = "";
  getBees(ourScene, compteur, add_bee, "new");

  setTimeout(() => {
    loadingScreen.classList.add("is-done");
    setTimeout(() => {
      document.body.removeChild(loadingScreen);
    }, 900);
  }, 3500);


  let radios = document.querySelectorAll('.radio');
  let labels = document.querySelectorAll('.label');
  let ball = document.querySelector('.ball');
  let prevRadio, prevLabel;
  radios.forEach((radio, index) => {
    radio.addEventListener('click', (e) => {
      if (prevRadio) prevRadio.classList.toggle('active');
      if (prevLabel) prevLabel.classList.toggle('active');
      radio.classList.toggle('active');
      prevRadio = radio;
      labels[index].classList.toggle('active');
      prevLabel = labels[index];
      ball.className = `ball pos${index}`;
    });
  });
});

const getBees = (ourScene, compteur, add_bee, trigger) => {
  fetch(mongo + "findAll")
    .then(response => response.json())
    .then(response => {
      let nb_bees = response.length ? response.length : 0;

      if (trigger === "new") {
        ourScene = new Scene(false, false, response);

        socket.on("newBee", (data) => {
          ourScene.addBee(
            new Bee(
              ourScene.getRenderer(),
              ourScene.getCamera(),
              ourScene.getScene(),
              data.bees[0].author,
              data.bees[0].message,
            )
          );
          getBees(ourScene, document.querySelector("#number"), false, false);

          toastr.success('Hey look at this newborn !', 'New bee', { "progressBar": true, "preventDuplicates": true });
        });

        if(add_bee) {
          add_bee.addEventListener("click", () => {
          swal({
            title: "Do you want to add your bee to the hive ?",
            html:
              '<p>You just have to attach a message and write your name !</p><p class="label">Your pseudo :</p><input id="author" class="swal2-input" type="text" placeholder="John Doe" required /><p class="label">Your message :</p><textarea id="message" class="swal2-input" placeholder="Bees are awesome !" required></textarea>',
            showCancelButton: true,
            confirmButtonText: "✔ Add my bee",
            cancelButtonText: "Cancel"
          }).then(result => {
              let author = document.querySelector("#author"),
                message = document.querySelector("#message");

              if (result.value && author.value.length > 0 && message.value.length > 0) {
                fetch(mongo + "create?author=" + author.value + "&message=" + message.value)
                  .then(response => response.json())
                  .then(response => {
                    socket.emit("addBee", { _id: response._id });
                  });
              } else if (result.value && author.value.length < 1 && message.value.length < 1) {
                swal("Uh oh, missing info ¯\_(ツ)_/¯", "You have to write your pseudo and your message to send a bee !", "error");
              }
            });
          });
        }
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


        modeTogglers.forEach(toggler => {
          toggler.addEventListener("change", e => {
            if(e.currentTarget.value === "worker") {
               ourScene.clear();
              fetch(mongo + "findAll")
                .then(response => response.json())
                .then(response => {
                  let nb_bees = response.length ? response.length : 0;
                  ourScene.setNumber(nb_bees);
                  for (let i = 0; i < nb_bees; i++) {
                    ourScene.addBee(new Bee(ourScene.getRenderer(), ourScene.getCamera(), ourScene.getScene()));
                  }
                  compteur.innerText = nb_bees;
                  range.value = nb_bees;
                }
              );

            }
            range.classList.toggle("is-hidden");
            add_bee.classList.toggle("is-hidden");
          });
        });

        aboutTrigger.addEventListener('click', ()=> {
          let text = ""
          let title = ""

          switch(ourScene.mode) {
            case "bad":
              title = "💀 All life is gone";
              text = "Is it Mars or Hell ? You don't really know. In fact, the only thing you're sure is that this place has nothing in common with the Earth you once knew. There's no life left here. With more than 99% of bees gone, over 90% of our food resources disappeared and things turned to something that reminds you of the Apocalypse. All life disappeared from Earth..."
            break;

            case "mediumBad":
              title = "🔥 Apocalypse now";
              text = "bleps"
            break;

            case "mediumGood":
              title = "You're here ☟";
               text= "blaps"
            break;

            case "good":
              title = "🌻 What a wonderful world";
              text = "feeling gooooood"
            break;
          }
          swal({
            title,
            text,
            button: "Back to the world"
          });
          document.querySelector(".swal2-container").classList.add('no-background');
        });
      }

      ourScene.setNumber(nb_bees);
      compteur.innerText = nb_bees;
      range.value = nb_bees;
    });
};
