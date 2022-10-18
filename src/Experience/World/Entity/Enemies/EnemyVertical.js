import * as THREE from 'three'
import Enemy from "./Enemy";
import getPhysicBody from "../../../Utils/PhysicBody";
import * as CANNON from "cannon-es";

export default class EnemyVertical extends Enemy
{
    body;
    shape;
    shootingDelay = 1;
    constructor(name)
    {
        super(name);

        // Debug
        if(this.debug.active)
        {
            if(Enemy.enemiesFolder)  this.debugFolder  = this.debug.ui.addFolder('EnemyVertical');
        }

        this.setMesh();
        this.scene.add(this.mesh)
        // setInterval(() => this.shoot(this), this.shootingDelay*1000);
    }

    setMesh(){
        this.material = new THREE.MeshBasicMaterial();
        this.mesh = new THREE.Mesh(Enemy._geometry, this.material);
        this.mesh.position.set(10, 1, 0);
        this.mesh.rotation.y = Math.PI * 0.5;


        getPhysicBody(this);
    }

    update()
    {
        super.update();
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}