/* eslint-disable no-unused-expressions */

import * as THREE from "three"
import TweenMax from "gsap"

class Bee {
  constructor (renderer, camera, scene) {
    this.renderer = renderer
    this.camera = camera
    this.scene = scene
    this.meshes = []
    this.materials = {}
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.animate = this.animate.bind(this)
    this.x = Math.random() * 8
    this.y = Math.random() * 8
    this.z = Math.random() * 8
    this.animationSpeed = Math.random() * 0.35
    return this.initialize()
  }

  initialize () {
    // materials
    this.materials.white = new THREE.MeshBasicMaterial({
      color: "#ffffff"
    })

    // Groups
    this.bee = new THREE.Group()

    // Geometries
    this.boxSquare = new THREE.BoxGeometry(0.25, 0.25, 0.25)

    // Meshes
    this.square = new THREE.Mesh(this.boxSquare, this.materials.white)

    // Buildings groups
    this.bee.add(this.square)

    // Positions
    this.bee.position.y = this.y
    this.bee.position.x = this.x
    this.bee.position.z = this.z

    // Shadows
    this.bee.castShadow = true
    this.bee.receiveShadow
    this.bee.traverse(node => (node.castShadow = true))

    this.bee.traverse(node => {
      // list of meshes
      if (node instanceof THREE.Mesh) {
        this.meshes.push(node)
      }
    })

    this.animate()
    this.handlers()

    TweenMax.to(
      this.bee.position, this.animationSpeed, {
        y:
          Math.random() * (1 - 0) + 0 > 0.5
            ? `+=${Math.random() * (2.5 - 1) + 1}`
            : `-=${Math.random() * (2.5 - 1) + 1}`,
        x:
          Math.random() * (1 - 0) + 0 > 0.5
            ? `+=${Math.random() * (0.25 - 0.05) + 0.05}`
            : `-=${Math.random() * (0.25 - 0.05) + 0.05}`,
        z:
          Math.random() * (1 - 0) + 0 > 0.5
            ? `+=${Math.random() * (0.25 - 0.05) + 0.05}`
            : `-=${Math.random() * (0.25 - 0.05) + 0.05}`,
        ease: Power2.easeOut,
        yoyo: true,
        repeat: -1
      }
    )
    return this.getModel()
  }

  animate () {
    requestAnimationFrame(this.animate)
    this.renderer.render(this.scene, this.camera)
  }

  getModel () {
    return this.bee
  }

  handleHover (e) {
    this.mouse.x = e.clientX / this.renderer.domElement.clientWidth * 2 - 1
    this.mouse.y = -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.meshes)

    if (intersects.length > 0) {
      document.body.style.cursor = "pointer"
      console.log("You hovered a bee")
    } else {
      document.body.style.cursor = "initial"
      console.log("You didn't hover a bee")
    }
  }

  handleClick (e) {
    this.mouse.x = e.clientX / this.renderer.domElement.clientWidth * 2 - 1
    this.mouse.y = -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.camera)

    let intersects = this.raycaster.intersectObjects(this.meshes)

    if (intersects.length > 0) {
      TweenMax.to(this.bee.position, 0.5, {
        z:
            this.camera.position.z,
        ease: Power2.easeOut,
        yoyo: true,
        repeat: 1
      })

      window.navigator.vibrate(2000)
    }
  }

  handlers () {
    window.addEventListener("mousemove", this.handleHover.bind(this))
    window.addEventListener("click", this.handleClick.bind(this))
  }
}

export default Bee

/* eslint-enable */
