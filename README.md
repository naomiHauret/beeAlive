# 🐝 Bee Alive

A live demo is available [here](https://naomihauret.github.io/beeAlive).
This project was realised as an assessment for our creative coding class.
It's a teamwork with [@MaitreManuel](https://github.com/MaitreManuel) :muscle:

---

## What the heck ?
Did you know that bees appeared approximately 100 millions years ago, roughly at the same period than flowering plants ? That they survived the mass extinction that wrecked *Tyrannosaurus Rex* of the surface of Earth ?

And did you know that :

- 84 % of known flowering plants need bees to survive
- 85 % of cultivated plants in Europe depends on bees for their pollination
-  Out of the hundres vegetal species that give us 90% of our food in the world, more than 70 % relies on bees to survive via pollination
- Without bees, Humanity won't last more than 2 years

Sadly, each year, approximately more than 20% of domestic honeybees hives disappear. Mostly because of Humanity's actions.

This project was born from this constat : no bees, no life. Here, we're exploring how the environment around us might look like with a certain amount of bees.

**If you want to help** saving bees, you can check [this website](https://savebees.org/). 🐝

## Tech Stack

* Webpack for the glory :raised_hands:
* ThreeJS
* SocketIO
* MongoDB

## How to ... ?

### Install

* Clone this repo on your computer
* `cd` to its folder
* `npm install`
* Install database [here](https://github.com/naomiHauret/beeAlive/blob/master/doc/DATABASE.md)
* You need to execute this bach command :

On Linux 16.04 and above :
```
ifconfig | grep 'inet addr' | cut -d: -f2 | awk '{print $1}' | tail -n1
```
On Linux 14.04 and earlier:
```
ifconfig | grep 'inet adr' | cut -d: -f2 | awk '{print $1}' | tail -n1
```
On MAC:
```
ifconfig | grep "inet " | grep -v 127.0.0.1 | cut -d\  -f2
```
Then keep this address and past it instead of XXX.XXX.X.XXX
* In `src/client/index.js`, you need to change `ip` variable :
```
const ip = '192.168.1.144';
const mongo = 'http://'+ ip +':3000/';
```
Then follow steps in next part. You really need to do this, else SocketIO and your front won't work.

### Run
* Start client only : `npm run start:client`
* Start server only: `npm run start:server`
* Start client + server: `npm start`

Then, hit `localhost:8080` in your favourite browser.

### Copyrights

#### Music
Many thanks to the one and only Jeremy Soule for his work. We're using Oblivion's soundtrack, more precisely :
- Wind from the Depths
- Deep Waters
- Auriel's Ascension
- Peace of Akatosh

#### Pictures
Many thanks to Pixar studios and Disney. Their work is amazing. We're using pictures from the following movies (and edited them a bit) :
- Wall-E
- Big Hero 6
- Up
