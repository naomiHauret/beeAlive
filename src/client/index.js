import styles from './styles/main.css';
import domready from 'domready';
import io from 'socket.io-client';
import { SERVER_PORT } from './../shared/config';
import Scene from './js/Scene';
import 'whatwg-fetch';
import TweenMax from "gsap";

const socket = io.connect(`http://localhost:${SERVER_PORT}`);
const mongo = 'http://localhost:3000/';
const loadingScreen = document.querySelector('[data-flag="loadingScreen"]');

socket.on('news', (data) => {
  console.log(data);
  socket.emit('other event', { my: 'data' });
});

domready(() => {
  setTimeout(() => {
    loadingScreen.classList.add("is-done");
    setTimeout(() => {
      document.body.removeChild(loadingScreen);
    }, 900);
  }, 2000)

  fetch(mongo +'findAll')
    .then((response) => response.json())
    .then((response) => {
      console.log("WOW", response);
    }
  );
  document.querySelector('#number').innerText = 15; // remplacer par variable qui init nombre d'abeilles
});

setTimeout(() => {
  const ourScene = new Scene(false, false);
}, 1500)
