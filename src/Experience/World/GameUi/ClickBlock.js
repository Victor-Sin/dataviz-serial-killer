import { Vector3, Vector2, Raycaster, PlaneGeometry, Mesh, MeshBasicMaterial } from 'three'
import Block from '../Entity/Block'
import Entity from '../Entity/Entity';

export default class ClickBlock extends Entity {
  #blockPlaceholder;
  #blockPlaceholderBody;
  #blockBody;
  #mouse;
  #raycaster;
  #blockTrigger;
  #blockFloor;
  #intersects;
  #canPose;
  #intersectsVec3;
  #mouseVec3;

  constructor(blockPlaceholder) {
    super()
    this.#blockPlaceholder = blockPlaceholder;
    this.#mouse = new Vector2();
    this.#raycaster = new Raycaster();
    this.#blockTrigger = document.querySelector('.blockTrigger');
    this.#blockFloor = null
    this.#intersects = null
    this.#canPose = false
    this.#raycaster.setFromCamera(this.#mouse, this.camera);

    this.createBlock()

    this.handlePoseMode()
    this.handleMouseMove()
    this.handlePoseClick()
  }

  createBlock() {
    this.#blockFloor = new Mesh(
      new PlaneGeometry(17.5, 17.5),
      new MeshBasicMaterial({ color: 0x000000, transparent: true })
    )
    this.#blockFloor.rotation.x = Math.PI * -0.5;
    this.#blockFloor.position.set(0, 0.001, 0);
    this.scene.add(this.#blockFloor)

  }

  handlePoseMode() {
    this.#blockTrigger.addEventListener('click', () => {
      if (!this.#canPose) {
        // this.block = new Block({ vector3: this.#mouseVec3 })
        this.#blockPlaceholder.getMesh().visible = true;
        this.#blockPlaceholderBody = this.#blockPlaceholder.getBody();
        console.log(this.#blockPlaceholderBody);
        setTimeout(() => {
          this.#canPose = true;
        }, 500);
      }
    })
  }

  handleMouseMove() {
    window.addEventListener('mousemove', (e) => {

      this.#intersects = this.#raycaster.intersectObject(this.#blockFloor);

      this.#mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.#mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.#raycaster.setFromCamera(this.#mouse, this.camera);

      this.#mouseVec3 = new Vector3(this.#mouse.x * 20, 1, -1 * this.#mouse.y * 20);
      if (this.#intersects.length > 0) {
        this.#intersectsVec3 = new Vector3(this.#intersects[0].point.x, 1.5, this.#intersects[0].point.z)
        if (this.#canPose) {
          this.#blockPlaceholder.getMesh().visible = true;

        }
        this.#blockPlaceholder.getMesh().position.set(this.#intersects[0].point.x, 1.5, this.#intersects[0].point.z)
      } else {
        this.#blockPlaceholder.getMesh().visible = false;
      }
      // this.#blockPlaceholder.getMesh().position.set(this.#mouseVec3.x, 1.5, this.#mouseVec3.z)
      // this.#blockPlaceholder.getMesh().position.set(this.#mouseVec3.x, 1, this.#mouseVec3.z)
    })
  }

  handlePoseClick() {
    window.addEventListener('click', (e) => {

      if (this.#canPose) {
        this.block = new Block({ vector3: this.#intersectsVec3 })
        this.#blockBody = this.block.getBody();
        this.block.setColliderEvent(this.#blockBody.addEventListener('collide', (e) => {
          console.log("collide");
          // if (e.body === this.#blockPlaceholderBody) {

          //   this.#canPose = false;
          //   console.log('true');

          // }
        }))
        this.#blockPlaceholder.getMesh().visible = false;
        this.#canPose = false;
      }
    })
  }

  update() {

  }
}
