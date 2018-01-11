import styles from './styles/main.css';
import domready from 'domready';
import io from 'socket.io-client';
import { SERVER_PORT } from './../shared/config';
import Scene from './js/Scene';
import 'whatwg-fetch';

const socket = io.connect(`http://localhost:${SERVER_PORT}`);
const mongo = 'http://localhost:3000/';

socket.on('news', (data) => {
  console.log(data);
  socket.emit('other event', { my: 'data' });
});

domready(() => {
  fetch(mongo +'findAll')
    .then((response) => response.json())
    .then((response) => {
      console.log("WOW", response);
    }
  );
  document.querySelector('#number').innerText = 15; // remplacer par variable qui init nombre d'abeilles
});

const ourScene = new Scene(false, false);
