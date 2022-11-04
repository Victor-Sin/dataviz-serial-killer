import * as THREE from 'three'
import Block from '../Entity/Block'
import Entity from '../Entity/Entity';

export default class ClickBlock extends Entity {
  constructor(blockPlaceholder) {
    super()
    this.blockPlaceholder = blockPlaceholder;
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.blockTrigger = document.querySelector('.blockTrigger');
    this.blockFloor = null
    this.intersects = null
    this.objects = []
    this.canPose = false
    this.setBlock()
  }

  setBlock() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.blockFloor = new THREE.Mesh(new THREE.PlaneGeometry(17.5, 17.5),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true }))
    this.blockFloor.rotation.x = Math.PI * -0.5;
    this.blockFloor.position.set(0, 0.001, 0);
    this.scene.add(this.blockFloor)



    this.eventBtn = this.blockTrigger.addEventListener('click', () => {
      if (!this.canPose) {
        // this.block = new Block({ vector3: this.mouseVec3 })
        this.blockPlaceholder.mesh.visible = true;
        setTimeout(() => {
          this.canPose = true;

        }, 500);
      }

    })
    window.addEventListener('mousemove', (e) => {

      this.intersects = this.raycaster.intersectObject(this.blockFloor);

      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);

      this.mouseVec3 = new THREE.Vector3(this.mouse.x * 20, 1, -1 * this.mouse.y * 20);
      if (this.intersects.length > 0) {
        this.intersectsVec3 = new THREE.Vector3(this.intersects[0].point.x, 1.5, this.intersects[0].point.z)
        if (this.canPose) {
          this.blockPlaceholder.mesh.visible = true;

        }
        this.blockPlaceholder.mesh.position.set(this.intersects[0].point.x, 1.5, this.intersects[0].point.z)
      } else {
        this.blockPlaceholder.mesh.visible = false;
      }
      // this.blockPlaceholder.mesh.position.set(this.mouseVec3.x, 1.5, this.mouseVec3.z)
      // this.blockPlaceholder.mesh.position.set(this.mouseVec3.x, 1, this.mouseVec3.z)
    })

    window.addEventListener('click', (e) => {
      if (this.canPose) {
        this.block = new Block({ vector3: this.intersectsVec3 })
        this.objects.push(this.block)
        this.blockPlaceholder.mesh.visible = false;
        this.canPose = false;
      }
    })

  }

  update() {

  }
}
