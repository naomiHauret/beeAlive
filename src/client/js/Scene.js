import * as THREE from "three"
import TweenMax from "gsap"
import threeOrbitControls from "./utils/OrbitControls"
import badBackground from "./../assets/img/bad.jpg"
import badBackgroundMusic from "./../assets/music/bad.mp3"
import mediumBackground from "./../assets/img/medium.png"
import mediumBackgroundMusic from "./../assets/music/medium.mp3"
import goodBackground from "./../assets/img/good.jpg"
import goodBackgroundMusic from "./../assets/music/good.mp3"

import Bee from "./Bee"

class Scene {
  constructor (showAxisHelper, showSpotlightHelper) {
    this.showAxisHelper = showAxisHelper
    this.showSpotlightHelper = showSpotlightHelper
    this.scene = new THREE.Scene()
    this.background = ""
    this.light = new THREE.AmbientLight(0x404040)
    this.spotLight = new THREE.SpotLight(0xffffff)
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    ) // field of view, aspect ratio (viewport size), near plane, far plane
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
<<<<<<< HEAD
    this.number = 15
=======
    this.number = 5
>>>>>>> added images assets
    this.bees = []
    this.animate = this.animate.bind(this)

    return this.initialize()
  }

  initialize () {
    // controls
    const OrbitControls = threeOrbitControls(THREE)

    // background
    if(this.number <= 25 ) {
      this.background = badBackground
    }
<<<<<<< HEAD
=======
    else if (this.number > 25 && this.number < 75){
      this.background = mediumBackground
    }
    else {
      this.background = goodBackground
    }
>>>>>>> added images assets

    const texture = new THREE.TextureLoader().load(this.background)
    this.scene.background = texture

    // light
    this.scene.add(this.light)

    // spotlight
    this.spotLight.position.set(10, 15, 10)
    this.spotLight.castShadow = true
    this.spotLight.decay = 7 // @TODO correct this
    this.spotLight.penumbra = 0.1 // @TODO correct this

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

    // scene controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    // mount scene
    this.hive = new THREE.Group()

    for (let i = 0; i < this.number; i++) {
      let bee = new Bee(this.renderer, this.camera, this.scene, this.number)
      this.bees.push(bee)
      this.hive.add(bee)
    }

    this.hive.rotation.x = THREE.Math.degToRad(15)

    this.addElement(this.hive)

    TweenMax.to(this.hive.position, 3, {
      y:
        Math.random() * (1 - 0) + 0 > 0.5
          ? `+=${Math.random() * (1.5 - 0.25) + 0.25}`
          : `-=${Math.random() * (1.5 - 0.25) + 0.25}`,
      x:
        Math.random() * (1 - 0) + 0 > 0.5
          ? `+=${Math.random() * (2.25 - 0.05) + 0.05}`
          : `-=${Math.random() * (2.25 - 0.05) + 0.05}`,
      z:
        Math.random() * (1 - 0) + 0 > 0.5
          ? `+=${Math.random() * (1.25 - 0.05) + 0.05}`
          : `-=${Math.random() * (1.25 - 0.05) + 0.05}`,
      ease: Power2.easeOut,
      yoyo: true,
      repeat: -1
    })

    document.body.appendChild(this.renderer.domElement) // append a canvas to body
    this.animate()
    this.handlers()
  }

  addElement (element) {
    this.scene.add(element)
  }

  animate () {
    requestAnimationFrame(this.animate)
    this.renderer.render(this.scene, this.camera)
  }

  toggleAxisHelper () {
    if (this.showAxisHelper === false) {
      this.scene.add(this.axisHelper)
      this.showAxisHelper = true
    } else {
      this.scene.remove(this.axisHelper)
      this.showAxisHelper = false
    }
  }

  toggleSpotLightHelper () {
    if (this.showSpotlightHelper === false) {
      this.scene.add(this.spotLightHelper)
      this.showSpotlightHelper = true
    } else {
      this.scene.remove(this.spotLightHelper)
      this.showSpotlightHelper = false
    }
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
