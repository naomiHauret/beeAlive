import * as THREE from "three"
import TweenMax from "gsap"
import badBackground from "./../assets/img/bad.jpg"
import badBackgroundMusic from "./../assets/music/bad.mp3"
import mediumBadBackground from "./../assets/img/mediumBad.jpg"
import mediumBadBackgroundMusic from "./../assets/music/mediumBad.mp3"
import mediumGoodBackground from "./../assets/img/mediumGood.png"
import mediumGoodBackgroundMusic from "./../assets/music/mediumGood.mp3"
import goodBackground from "./../assets/img/good.png"
import goodBackgroundMusic from "./../assets/music/good.mp3"

import Bee from "./Bee"

class Scene {
  constructor(showAxisHelper, showSpotlightHelper, bees_server) {
    this.showAxisHelper = showAxisHelper;
    this.showSpotlightHelper = showSpotlightHelper;
    this.scene = new THREE.Scene();
    this.mode = "";
    this.background = "";
    this.meshes = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(0, 0);
    this.audios = {
      good: new Audio(goodBackgroundMusic),
      mediumGood: new Audio(mediumGoodBackgroundMusic),
      mediumBad: new Audio(mediumBadBackgroundMusic),
      bad: new Audio(badBackgroundMusic)
    };
    this.light = new THREE.AmbientLight(0x404040);
    this.spotLight = new THREE.SpotLight(0xffffff);
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    ); // field of view, aspect ratio (viewport size), near plane, far plane
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.bees_server = bees_server;
    this.number = bees_server.length;
    this.bees = [];
    this.t = 0; // time delta
    this.configureScenery = this.configureScenery.bind(this);
    this.addBee = this.addBee.bind(this);
    this.removeBeesFromHive = this.removeBeesFromHive.bind(this);
    this.animate = this.animate.bind(this);
    this.setNumber = this.setNumber.bind(this);
    this.stopAudio = this.stopAudio.bind(this);
    this.clear = this.clear.bind(this);
    this.updateMeshes = this.updateMeshes.bind(this)

    return this.initialize();
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }

  getScene() {
    return this.scene;
  }

  getNumber() {
    return this.number;
  }

  getMode() {
    return this.mode;
  }

  setNumber(number) {
    this.number = number;
  }

  initialize() {
    // Ray caster
    this.raycaster.ray.direction.set(0, -1, 0);

    // loopable audios
    Object.keys(this.audios).map(audio => (this.audios[audio].loop = true));
    const texture = new THREE.TextureLoader().load(this.background);
    this.scene.background = new THREE.Color(0xff0000);
    this.scene.background = texture;

    // configure background and audio
    this.configureScenery();

    // light
    this.scene.add(this.light);

    // spotlight
    this.spotLight.position.set(10, 15, 10);
    this.spotLight.castShadow = true;
    this.spotLight.decay = 7;
    this.spotLight.penumbra = 0.1;

    this.scene.add(this.spotLight);

    // camera
    this.camera.position.z = 100;
    this.camera.position.y = 1;
    this.camera.position.x = 25;

    // renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight); // same size than our aspect ratio
    this.renderer.setClearColor(0xffffff, 0); // transparent background
    this.renderer.shadowMap.enabled = true;

    // scene helpers
    this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    this.axisHelper = new THREE.AxisHelper(5);
    this.showSpotlightHelper && this.scene.add(this.spotLightHelper);
    this.showAxisHelper && this.scene.add(this.axisHelper);

    // mount scene
    this.hive = new THREE.Group();

    for (let i = 0; i < this.number; i++) {
      let bee = new Bee(this.renderer, this.camera, this.scene, this.bees_server[i].author, this.bees_server[i].message);
      this.bees.push(bee);
      this.hive.add(bee);
    }

    this.hive.rotation.x = THREE.Math.degToRad(25);
    let box = new THREE.Box3()
      .setFromObject(this.hive)
      .getCenter(this.hive.position)
      .multiplyScalar(-1);

    this.addElement(this.hive);
    this.updateMeshes();
    document.body.appendChild(this.renderer.domElement); // append a canvas to body
    this.animate();
    this.handlers();
  }

  /*
  * -- clear all meshes
  */
  clear() {
    for (let i = this.hive.children.length - 1; i >= 0; i--) {
      this.hive.remove(this.hive.children[i]);
    }
    this.configureScenery();
  }

  /*
  * -- configure scenery (background to display, audio to play) of current Scene instance
  */
  configureScenery() {
    let changedBackground = false;

    if (this.number <= 5 && this.mode !== "bad") {
      this.stopAudio();
      this.background = badBackground;
      this.audios.bad.play();
      this.mode = "bad";
      changedBackground = true;
    } else if (
      this.number > 5 &&
      this.number < 15 &&
      this.mode !== "mediumBad"
    ) {
      this.stopAudio();
      this.background = mediumBadBackground;
      this.audios.mediumBad.play();
      this.mode = "mediumBad";
      changedBackground = true;
    } else if (
      this.number > 15 &&
      this.number < 20 &&
      this.mode !== "mediumGood"
    ) {
      this.stopAudio();
      this.background = mediumGoodBackground;
      this.audios.mediumGood.play();
      this.mode = "mediumGood";
      changedBackground = true;
    } else if (this.number > 20 && this.mode !== "good") {
      this.stopAudio();
      this.background = goodBackground;
      this.audios.good.play();
      this.mode = "good";
      changedBackground = true;
    }

    if (changedBackground === true) {
      let texture = new THREE.TextureLoader().load(this.background);
      this.scene.background = texture;
    }

    this.updateMeshes()
  }

  /*
  * -- update meshes
  */
  updateMeshes() {
    this.meshes = [];
    this.scene.traverse(node => {
      // list of meshes
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        this.meshes.push(node);
      }
    });
  }
  /*
  * -- stop current song
  */
  stopAudio() {
    Object.keys(this.audios).map(audio => {
      this.audios[audio].pause();
      this.audios[audio].currentTime = 0;
    });
  }
  /*
  * -- add THREE element to current Scene instance
  */
  addElement(element) {
    this.scene.add(element);
  }

  /*
  * -- add bee to the hive
  */
  addBee(bee) {
    this.hive.add(bee);
    this.configureScenery();
  }

  /*
  * -- remove x bees from hive
  */
  removeBeesFromHive(nb) {
    for (let i = 0; i < nb; i++) {
      this.hive.remove(this.hive.children[i]);
      this.configureScenery();
    }
  }
  /*
  * -- animate current Scene instance
  */
  animate() {
    requestAnimationFrame(this.animate);
    this.t += 0.0005;
    this.hive.position.x = 20 * Math.cos(this.t) + 0;
    this.hive.position.z = 10 * Math.sin(this.t) + 0;
    this.renderer.render(this.scene, this.camera);
  }


  handleHover (e) {
    this.mouse.x = e.clientX / this.renderer.domElement.clientWidth * 2 - 1
    this.mouse.y = -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.meshes)

    if (intersects.length > 0) {
      document.body.style.cursor = "pointer"
    } else {
      document.body.style.cursor = "initial"
    }
  }


  handleResize() {
    // Keep aspect ratio of the scene
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  handlers() {
    window.addEventListener("mousemove", this.handleHover.bind(this));
    window.addEventListener("resize", this.handleResize.bind(this));
  }
}

export default Scene
