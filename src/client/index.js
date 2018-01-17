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
const ip = "192.168.0.16";
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
              title = "💀 Hallucination of a starving soul";
              text = "Sometimes, when the hunger is too strong, I can see bees flying right in front of my eyes. It's stupid, since they're all either dead or flying through space with the richest ones. It's a feeling I both hate and love : buzzing all around my head, they cover this toxic wasteland I once called Earth. Their sound hide the screams of Men being devoured by others, for that's all there's left to eat: rocks, mud and the weakest of these wretched cannibalistic beings that once stand proudly as 'Humans'... They remind me of something we once were: a society in order."
            break;

            case "mediumBad":
              title = "🔥 Hopes of a survivor";
              text = "'Could things get worse ?' I wonder this everyday while looking for forgotten rations of food in the ruined houses and blown up buildings. That's when a bomb fell down from the skies to strike down what was still standing. We were at war. Everyone was. But it wasn't only a World Wide War: it's was also a war amoung people of the same country, cities, families. Hunger was striking us all, no matter how poor or rich we were. Humanity might take pride of being the most 'intelligent, cultivated species' of all, the top of food chain, if there wasn't anything to eat then there wasn't anything to be proud of. Especially when you're the one responsible for the disparition of all food source. If we were that superior, that intelligent, we could've prevent all this. But maybe it's not too late ? Maybe we can still save ourselves... I can see few bees, flying over what looks like a dandelion. What a sight to behold... They're so rare today, preciously captured (for what reason ? I'm not sure...). Our flying hope... Over 70% of what we ate was due to the work of bees : pollination. They fed us. They flew over Earth for more than 100,000 millions years, survived to a mass extinction, the same one that killed T-Rex. And yet, in 50 years, we nearly them all, causing our fall.."
            break;

            case "mediumGood":
              title = "☟ You're here";
              text = "Almonds, apples, apricots, avocados, blueberries, cantaloupes, cashews, coffee, cranberries, cucumbers, eggplants, grapes, kiwis, mangoes, okra, peaches, pears, peppers, strawberries, tangerines, walnuts,  watermelons... I can't believe how many rare or expensive these things got lately. In the news, I read that more than 20% of domestic honeybees hives disappear each year and that without bees, we won't last more than 2 years. I wonder if it's true... yet hope I won't get to know the answer to that question one day."


            break;

            case "good":
              title = "🌻 What a wonderful world";
              text = "It's so peaceful... I can understand why bees symbolize order, society and purity. When bees are well, Humanity is too. May things always be in that state."
            break;
          }
          swal({
            title,
            text,
            button: "🔙 Back to the hive"
          });
          document.querySelector(".swal2-container").classList.add('no-background');
        });
      }

      ourScene.setNumber(nb_bees);
      compteur.innerText = nb_bees;
      range.value = nb_bees;
    });
};
