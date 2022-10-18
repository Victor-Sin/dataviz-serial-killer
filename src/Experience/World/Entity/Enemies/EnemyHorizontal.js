import * as THREE from 'three'
import Enemy from "./Enemy";
import * as CANNON from "cannon-es";
import getPhysicBody from "../../../Utils/PhysicBody";

export default class EnemyHorizontal extends Enemy
{
    shape;
    body;
    mesh;
    shootingDelay = 0.5;
    constructor()
    {
        super();

        // Debug
        if(this.debug.active)
        {
            if(Enemy.enemiesFolder)  this.debugFolder  = Enemy.enemiesFolder.addFolder('EnemyHorizontal');
            this.debugFolder.close();
            this.setGui()
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

    setGui(){
        if(this.debugFolder){
            this.debugFolder.add(this,'force',0,10,0.1)
            this.debugFolder.add(this,'shootingDelay',0,5,0.01);
        }
    }

    update()
    {
        super.update();
    }
}