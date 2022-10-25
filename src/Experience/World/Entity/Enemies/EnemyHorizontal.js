import * as THREE from 'three'
import Enemy from "./Enemy";
import getPhysicBody from "../../../Utils/PhysicBody";
import BodyTypes from "../../../Utils/BodyTypes";

export default class EnemyHorizontal extends Enemy
{
    shape;
    body;
    mesh;
    shootingDelay = 1;
    orientation = 'x';

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
    }


    setMesh(){
        this.material = new THREE.MeshBasicMaterial();
        this.mesh = new THREE.Mesh(Enemy._geometry, this.material);
        this.mesh.position.set(0, 1, -10);

        getPhysicBody(this,{
            mass: 1000,
            type: 2,
            collisionFilterMask:  BodyTypes.NONE
        });
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