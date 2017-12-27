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
    this.mouse = new THREE.Vector2(0, 0)
    this.animate = this.animate.bind(this)
    this.deg = 0
    this.x = 5
    this.y = 5
    this.z = 5
    this.animationSpeed = Math.random() * (0.15 - 0.085) + 0.085
    return this.initialize()
  }

  initialize () {
    // Ray caster
    this.raycaster.ray.direction.set(0, -1, 0)

    // materials
    this.materials.white = new THREE.MeshBasicMaterial({
      color: "#FFFFFF"
    })
    this.materials.yellow = new THREE.MeshBasicMaterial({
      color: "#F6D268"
    })
    this.materials.black = new THREE.MeshBasicMaterial({
      color: "#1E1D1C"
    })

    this.materials.grey = new THREE.MeshBasicMaterial({
      color: "#494846"
    })

    // Groups
    this.bee = new THREE.Group()
    this.head = new THREE.Group()
    this.body = new THREE.Group()
    this.wings = new THREE.Group()

    // Geometries
    this.headBaseGeometry = new THREE.DodecahedronGeometry(1, 0)
    this.headMuzzleGeometry = new THREE.CylinderGeometry(0.5, 1, 2, 3)

    // Meshes
    this.headBase = new THREE.Mesh(this.headBaseGeometry, this.materials.black)
    this.headMuzzle = new THREE.Mesh(this.headMuzzleGeometry, this.materials.yellow)

    // Buildings groups

    this.head.add(this.headBase)
    this.head.add(this.headMuzzle)
    this.headMuzzle.position.x = 1.5
    this.headMuzzle.rotation.w = 90

    this.bee.add(this.head)

    // Positions
    this.bee.position.y = this.y
    this.bee.position.x = this.x
    this.bee.position.z = this.z

    // Shadows
    this.bee.castShadow = true
    this.bee.receiveShadow

    this.bee.traverse(node => {
      // list of meshes
      if (node instanceof THREE.Mesh) {
        node.castShadow = true
        this.meshes.push(node)
      }
    })

    // this.animate()
    this.handlers()

/*     TweenMax.to(
      this.bee.position, this.animationSpeed, {
        y: Math.random() * (1 - 0) + 0 > 0.5
          ? `+=${Math.random() * 8}`
          : `-=${Math.random() * 8}`,
        x: Math.random() * (1 - 0) + 0 > 0.5
          ? `+=${Math.random() * 8}`
          : `-=${Math.random() * 8}`,
        z: Math.random() * (1 - 0) + 0 > 0.5
          ? `+=${Math.random() * 8}`
          : `-=${Math.random() * 8}`,
        ease: Power2.easeOut,
        yoyo: true,
        repeat: -1
      }
    ) */

    return this.getModel()
  }

  animate () {
    requestAnimationFrame(this.animate)
    this.renderer.render(this.scene, this.camera)
  }

  getModel () {
    return this.bee
  }

  handleMouseover (e) {
    this.mouse.x = e.clientX / this.renderer.domElement.clientWidth * 2 - 1
    this.mouse.y = -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1
  }

  handleClick (e) {
    console.log("clicked")
    this.raycaster.setFromCamera(this.mouse, this.camera)

    let intersects = this.raycaster.intersectObjects(this.meshes)

    if (intersects.length > 0) {
      console.log("clicked bee")
      TweenMax.to(this.bee.position, 0.5, {
        z: 5,
        x: 5,
        y: 5,
        ease: Power2.easeOut,
        yoyo: true,
        repeat: 1
      })

      window.navigator.vibrate(2000)
    }
  }

  handlers () {
    window.addEventListener("mousemove", this.handleMouseover.bind(this))
    window.addEventListener("click", this.handleClick.bind(this))
  }
}

export default Bee

/* eslint-enable */
