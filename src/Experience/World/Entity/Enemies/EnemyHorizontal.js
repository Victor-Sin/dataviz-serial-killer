import * as THREE from 'three'
import Enemy from "./Enemy";
import * as CANNON from "cannon-es";
import getPhysicBody from "../../../Utils/PhysicBody";

export default class EnemyHorizontal extends Enemy
{
    shape;
    body;
    mesh;
    shootingDelay = 1;
    constructor()
    {
        super();

        // Debug
        if(this.debug.active)
        {
            if(Enemy.enemiesFolder)  this.debugFolder  = this.debug.ui.addFolder('EnemyHorizontal');
        }

        this.setMesh();

        this.scene.add(this.mesh)
        // setInterval(() => this.shoot(this), this.shootingDelay*1000);
    }

    setMesh(){
        this.material = new THREE.MeshBasicMaterial();
        this.mesh = new THREE.Mesh(Enemy._geometry, this.material);
        this.mesh.position.set(0, 1, -10);

        getPhysicBody(this);
    }

    update()
    {
        super.update();
    }
}