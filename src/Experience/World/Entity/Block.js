import { Vector3, BoxGeometry, MeshBasicMaterial, Mesh } from 'three'
import Entity from './Entity';
import getPhysicBody from '../../Utils/PhysicBody';
import bodyTypes from '../../Utils/BodyTypes';


export default class Block extends Entity {
  static #meshGlobal;
  static blocks = [];
  #toRemove = false;
  #eventCollider
  #basicParams = {
    width: 1,
    depth: 1,
    vector3: new Vector3(0, 0, 0),
    opacity: 1,

  };
  #colliderEvent;

  constructor(params = { width: 1, depth: 1, vector3: new Vector3(0, 0, 0), opacity: 1 }) {
    super();
    this.composer = this.experience.composer
    params = { ...this.#basicParams, ...params };
    this.setMesh(params);
    Block.blocks.push(this)

    this.scene.add(this._mesh)
    

  }
  setColliderEvent(event) {
    this.#colliderEvent = event;
  }

  setMesh({ width, depth, vector3, opacity }) {
    let filterMask =  bodyTypes.PLACEHOLDER|  bodyTypes.PLAYER | bodyTypes.BULLETS | bodyTypes.OTHERS;
    let filterGroup =  bodyTypes.OBSTACLES
    let type = 2;
    
    if (!Block.#meshGlobal) {
      const geometry = new BoxGeometry(width, 2, depth);
      const material = new MeshBasicMaterial();
      Block.#meshGlobal = new Mesh(geometry, material);
    }
    this._mesh = Block.#meshGlobal.clone();
    this._mesh.geometry = new BoxGeometry(width, 2, depth);
    if (opacity != 1) {
      this._mesh.material = new MeshBasicMaterial()
      this._mesh.visible = false;
      this._mesh.material.opacity = opacity;
      this._mesh.material.transparent = true;
      filterMask = -1;
      filterGroup = bodyTypes.PLACEHOLDER;
      type = 1
      this.composer.addSelectedObject(this._mesh)
    }
    this._mesh.position.set(vector3.x, 1.5, vector3.z)
    getPhysicBody(this, {
      mass: 40000,
      fixedRotation: true,
      collisionFilterMask: filterMask,
      collisionFilterGroup: filterGroup,
      type: type,
      isTrigger: true
    });

  }



  update() {
    if (this._body && this._mesh) {
      this._body.position.copy(this._mesh.position)
      this._body.quaternion.copy(this._mesh.quaternion)
    }
    if(this.#toRemove){
      this.world.removeBody(this._body);
      this._body.removeEventListener('collide',this.#eventCollider)

      this.scene.remove(this._mesh)
      this._mesh.material.dispose()
      this._mesh.geometry.dispose()
      this.composer.removeSelectedObject(this._mesh)

    }
  }
}
