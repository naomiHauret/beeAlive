import styles from './styles/main.css';
import domready from 'domready';
import io from 'socket.io-client';
import swal from 'sweetalert2';
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
  const add_bee = document.querySelector('#send-bee');

  fetch(mongo +'findAll')
    .then((response) => response.json())
    .then((response) => {
      let nb_bees = response.length;

      const ourScene = new Scene(false, false, nb_bees);
      document.querySelector('#number').innerText = nb_bees;
    }
  );

  add_bee.addEventListener('click', () => {
    swal({
      title: 'Do you want to send a bee ?',
      text: 'You can attach a message and write your name !',
      html: '<p class="label">Author :</p><input id="author" class="swal2-input" type="text" placeholder="Your author name" /><p class="label">Message :</p><input id="message" class="swal2-input type="text" placeholder="Your message here" />',
      showCancelButton: true,
      confirmButtonText: 'Yes, of course !',
      cancelButtonText: 'No, thx I keep watchin\''
    });
  });
});
