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
  constructor (showAxisHelper, showSpotlightHelper, nb_bees) {
    this.showAxisHelper = showAxisHelper
    this.showSpotlightHelper = showSpotlightHelper
    this.scene = new THREE.Scene()
    this.background = ""
    this.audios = {
      good: new Audio(goodBackgroundMusic),
      mediumGood: new Audio(mediumGoodBackgroundMusic),
      mediumBad: new Audio(mediumBadBackgroundMusic),
      bad: new Audio(badBackgroundMusic)

    }
    this.light = new THREE.AmbientLight(0x404040)
    this.spotLight = new THREE.SpotLight(0xffffff)
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    ) // field of view, aspect ratio (viewport size), near plane, far plane
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.number = nb_bees
    this.bees = []
    this.t = 0 // time delta
    this.configureScenery = this.configureScenery.bind(this)
    this.addBee = this.addBee.bind(this)
    this.animate = this.animate.bind(this)

    return this.initialize()
  }

  initialize () {
    // loopable audios
    Object.keys(this.audios).map(audio => this.audios[audio].loop = true)
    const texture = new THREE.TextureLoader().load(this.background)
    this.scene.background = texture

    // configure background and audio
    this.configureScenery()

    // light
    this.scene.add(this.light)

    // spotlight
    this.spotLight.position.set(10, 15, 10)
    this.spotLight.castShadow = true
    this.spotLight.decay = 7
    this.spotLight.penumbra = 0.1

    this.scene.add(this.spotLight)

    // camera
    this.camera.position.z = 100
    this.camera.position.y = 1
    this.camera.position.x = 25

    // renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight) // same size than our aspect ratio
    this.renderer.setClearColor(0xffffff, 0) // transparent background
    this.renderer.shadowMap.enabled = true

    // scene helpers
    this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight)
    this.axisHelper = new THREE.AxisHelper(5)
    this.showSpotlightHelper && this.scene.add(this.spotLightHelper)
    this.showAxisHelper && this.scene.add(this.axisHelper)

    // mount scene
    this.hive = new THREE.Group()

    for (let i = 0; i < this.number; i++) {
      let bee = new Bee(this.renderer, this.camera, this.scene)
      this.bees.push(bee)
      this.hive.add(bee)
    }

    this.hive.rotation.x = THREE.Math.degToRad(25)
    this.addElement(this.hive)

    document.body.appendChild(this.renderer.domElement) // append a canvas to body
    this.animate()
    this.handlers()
  }

  /*
  * -- configure scenery (background to display, audio to play) of current Scene instance
  */
  configureScenery() {
    Object.keys(this.audios).map(audio => {
      this.audios[audio].pause()
      this.audios[audio].currentTime = 0
    })

    // background
    if (this.number <= 5) {
      this.background = badBackground
      this.audios.bad.play()
    }
    else if (this.number > 5 && this.number < 15) {
      this.background = mediumBadBackground
      this.audios.mediumBad.play()
    }
    else if (this.number > 15 && this.number < 20) {
      this.background = mediumGoodBackground
      this.audios.mediumGood.play()
    }
    else {
      this.background = goodBackground
      this.audios.good.play()
    }

    let texture = new THREE.TextureLoader().load(this.background)
    this.scene.background = texture
  }

  /*
  * -- add THREE element to current Scene instance
  */
  addElement(element) {
    this.scene.add(element)
  }

  /*
  * -- add bee to the hive
  */
  addBee(bee) {
    this.hive.add(bee)
    this.configureScenery()
  }

  /*
  * -- animate current Scene instance
  */
  animate () {
    requestAnimationFrame(this.animate)
    this.t += 0.009
    this.hive.position.x = Math.cos(this.t) + 0
    this.hive.position.z = 10 * Math.sin(this.t) + 0
    this.renderer.render(this.scene, this.camera)
  }

  handleResize () {
    // Keep aspect ratio of the scene
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  handlers () {
    window.addEventListener("resize", this.handleResize.bind(this))
  }
}

export default Scene
