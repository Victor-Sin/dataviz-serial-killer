import {Vector3, BoxGeometry,MeshBasicMaterial,Mesh} from 'three'
import Entity from './Entity';


export default class Block extends Entity {
  static #meshGlobal;
  static blocks = [];
  #basicParams = {
    width: 1,
    depth: 1,
    vector3: new Vector3(0, 0, 0),
    opacity: 1,
   
  };

  constructor(params = {width: 1, depth: 1, vector3: new Vector3(0, 0, 0), opacity: 1}) {
    super();
    params = { ...this.#basicParams, ...params };
    this.setMesh(params);
    Block.blocks.push(this)

    this.scene.add(this._mesh)

  }

  setMesh({ width, depth, vector3, opacity }) {
    if (!Block.#meshGlobal) {
      const geometry = new BoxGeometry(1, 2, 1);
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
    }
    this._mesh.position.set(vector3.x, 1.5, vector3.z)

  }



  update() {
  }
}
