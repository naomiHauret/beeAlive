import * as THREE from "three"
import TweenMax from "gsap"

class Bee {
  constructor (renderer, camera, scene, nb) {
    this.renderer = renderer
    this.camera = camera
    this.scene = scene
    this.meshes = []
    this.materials = {}
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2(0, 0)
    this.animate = this.animate.bind(this)
    this.deg = 0
    this.x = Math.random() * 20
    this.y = Math.random() * 20
    this.z = Math.random() * 20
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
      color: "#211f1e"
    })

    this.materials.brown = new THREE.MeshBasicMaterial({
      color: "#2E2516"
    })

    // Groups
    this.bee = new THREE.Group()
    this.head = new THREE.Group()
    this.body = new THREE.Group()
    this.abdomen = new THREE.Group()
    this.wings = new THREE.Group()

    // Geometries

    // -- head
    this.headBaseGeometry = new THREE.CylinderGeometry(0.4, 0.25, 0.25, 8)
    this.headMuzzleGeometry = new THREE.TetrahedronGeometry(0.65, 1)

    // -- body
    // --- thorax
    this.thoraxGeometry = new THREE.SphereGeometry(0.65, 8, 9, 1, 6.3, 3, 6.3)

    // --- abdomen
    this.abdomenSlice1Geometry = new THREE.CylinderGeometry(0.25, 0.6, 0.5, 8)
    this.abdomenSlice2Geometry = new THREE.CylinderGeometry(0.6, 0.75, 0.45, 8)
    this.abdomenSlice3Geometry = new THREE.CylinderGeometry(0.75, 0.75, 0.45, 8)
    this.abdomenSlice4Geometry = new THREE.CylinderGeometry(0.75, 0.6, 0.45, 8)
    this.abdomenSlice5Geometry = new THREE.CylinderGeometry(0.6, 0.25, 0.5, 8)

    // --- sting
    this.stingGeometry = new THREE.ConeGeometry(0.25, 0.35, 3)

    // --- wings
    this.wingLargeGeometry = new THREE.ConeGeometry(2, 0.25, 2, 0.25, 1, 1, 0.5)

    // Meshes
    // -- head
    this.headBase = new THREE.Mesh(this.headBaseGeometry, this.materials.black)
    this.headMuzzle = new THREE.Mesh(this.headMuzzleGeometry, this.materials.black)

    // -- body
    // --- thorax
    this.thorax = new THREE.Mesh(this.thoraxGeometry, this.materials.brown)

    // --- abdomen
    this.abdomenSlice1 = new THREE.Mesh(this.abdomenSlice1Geometry, this.materials.black)
    this.abdomenSlice2 = new THREE.Mesh(this.abdomenSlice2Geometry, this.materials.yellow)
    this.abdomenSlice3 = new THREE.Mesh(this.abdomenSlice3Geometry, this.materials.black)
    this.abdomenSlice4 = new THREE.Mesh(this.abdomenSlice4Geometry, this.materials.yellow)
    this.abdomenSlice5 = new THREE.Mesh(this.abdomenSlice5Geometry, this.materials.black)

    // --- sting
    this.sting = new THREE.Mesh(this.stingGeometry, this.materials.black)

    // --- wings
    this.wingLeft = new THREE.Mesh(this.wingLargeGeometry, this.materials.white)
    this.wingRight = new THREE.Mesh(this.wingLargeGeometry, this.materials.white)

    // Buildings groups
    this.head.add(this.headBase)
    this.head.add(this.headMuzzle)

    this.abdomen.add(this.abdomenSlice1)
    this.abdomen.add(this.abdomenSlice2)
    this.abdomen.add(this.abdomenSlice3)
    this.abdomen.add(this.abdomenSlice4)
    this.abdomen.add(this.abdomenSlice5)
    this.abdomen.add(this.sting)

    this.wings.add(this.wingLeft)
    this.wings.add(this.wingRight)

    this.body.add(this.thorax)
    this.body.add(this.abdomen)
    this.body.add(this.wings)
    this.bee.add(this.head)
    this.bee.add(this.body)

    // Positions
    // -- head
    this.head.position.y = 0.7
    this.headMuzzle.position.y = 0.35

    // -- body
    // --- abdomen
    this.abdomen.position.y = -0.5
    this.abdomen.rotation.x = THREE.Math.degToRad(-25)

    // ---wings
    this.wings.rotation.x = THREE.Math.degToRad(-90)
    this.wingLeft.position.x = 0.425
    this.wingRight.position.x = -0.425
    this.wingRight.position.z = -0.25
    this.wingRight.rotation.y = THREE.Math.degToRad(180)

    // --- sting
    this.sting.position.y = -2.325
    this.sting.rotation.x = THREE.Math.degToRad(180)

    // ---- abdomen slices
    this.abdomenSlice2.position.y = -0.475
    this.abdomenSlice3.position.y = -0.95
    this.abdomenSlice4.position.y = -1.425
    this.abdomenSlice5.position.y = -1.9

    // Bee
    this.bee.position.y = this.y
    this.bee.position.x = this.x
    this.bee.position.z = this.z

    // Shadows
    this.bee.castShadow = true
    this.bee.receiveShadow
    this.bee.rotation.x = THREE.Math.degToRad(90)
    this.bee.traverse(node => {
      // list of meshes
      if (node instanceof THREE.Mesh) {
        node.castShadow = true
        this.meshes.push(node)
      }
    })

    // this.animate()
    this.handlers()

    TweenMax.to(
      this.bee.position, 1.25, {
        y: Math.random() * 5,
        yoyo: true,
        repeat: -1
      }
    )

    TweenMax.to(
      this.wingLeft.rotation, 0.035, {
        z: 0.75,
        yoyo: true,
        repeat: -1
      }
    )
    TweenMax.to(
      this.wingRight.rotation, 0.035, {
        z: 0.75,
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

  handleMouseover (e) {
    this.mouse.x = e.clientX / this.renderer.domElement.clientWidth * 2 - 1
    this.mouse.y = -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1
  }

  handleClick (e) {
    this.raycaster.setFromCamera(this.mouse, this.camera)

    let intersects = this.raycaster.intersectObjects(this.meshes)

    if (intersects.length > 0) {
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
