/* eslint-disable no-unused-expressions */

import * as THREE from "three"
import TweenMax from "gsap"
import Bee from "./Bee"

class Hive {
  constructor (renderer, camera, scene) {
    this.renderer = renderer
    this.camera = camera
    this.scene = scene
    this.bees = []
    this.beesNumber = 50
    this.hive = new THREE.Group()

    this.animate = this.animate.bind(this)
    return this.initialize()
  }

  initialize () {
    // Buildings groups
    for (let i = 0; i < this.beesNumber; i++) {
      let bee = new Bee(this.renderer, this.camera, this.scene)
      this.bees.push(bee)
      this.hive.add(bee)
    }

    // Positions
    this.hive.position.x = 1
    this.hive.position.y = 1
    this.hive.position.z = 1

    // Shadows
    this.hive.castShadow = true
    this.hive.receiveShadow
    this.hive.traverse(node => (node.castShadow = true))

    this.hive.traverse(node => {
      // list of meshes
      if (node instanceof THREE.Mesh) {
        this.meshes.push(node)
      }
    })

    this.animate()

    TweenMax.to(this.hive.position, 5, {
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
    })
    return this.getModel()
  }

  animate () {
    requestAnimationFrame(this.animate)
    this.renderer.render(this.scene, this.camera)
  }

  getModel () {
    return this.hive
  }
}

export default Hive

/* eslint-enable */
