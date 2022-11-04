import * as THREE from 'three'
import Experience from '../../Experience'
import Entity from './Entity';
import * as CANNON from "cannon-es";


export default class Block extends Entity {
  static meshGlobal;
  static blocks = [];
  basicParams = {
    width: 1,
    depth: 1,
    vector3: new THREE.Vector3(0, 0, 0),
    opacity: 1,
   
  };

  constructor(params = {
    width: 1,
    depth: 1,
    vector3: new THREE.Vector3(0, 0, 0),
    opacity: 1,

  }) {
    super();
    params = { ...this.basicParams, ...params };
    this.setMesh(params);
    Block.blocks.push(this)

    this.scene.add(this.mesh)

  }

  setMesh({ width, depth, vector3, opacity }) {
    if (!Block.meshGlobal) {
      const geometry = new THREE.BoxGeometry(1, 2, 1);
      const material = new THREE.MeshBasicMaterial();
      Block.meshGlobal = new THREE.Mesh(geometry, material);
    }
    this.mesh = Block.meshGlobal.clone();
    this.mesh.geometry = new THREE.BoxGeometry(width, 2, depth);
    if (opacity != 1) {
      this.mesh.material = new THREE.MeshBasicMaterial()
      this.mesh.visible = false;
      this.mesh.material.opacity = opacity;
      this.mesh.material.transparent = true;
    }
    this.mesh.position.set(vector3.x, 1.5, vector3.z)

  }



  update() {
  }
}
