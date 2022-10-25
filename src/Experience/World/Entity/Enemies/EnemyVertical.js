import * as THREE from 'three'
import Enemy from "./Enemy";
import getPhysicBody from "../../../Utils/PhysicBody";
import * as CANNON from "cannon-es";
import { Clock } from 'three';

export default class EnemyVertical extends Enemy
{
    body;
    shape;
    shootingDelay = 0.33;
    constructor(name)
    {
        super(name);

        // Debug
        if(this.debug.active)
        {
            if(Enemy.enemiesFolder)  this.debugFolder = Enemy.enemiesFolder.addFolder('EnemyVertical');
            this.debugFolder.close();

            this.setGui();

        }
        this.clock = new THREE.Clock();


        this.setMesh();
        this.enemyVerticalMove();
        this.scene.add(this.mesh)
    }

    setMesh(){
        this.material = new THREE.MeshBasicMaterial();
        this.mesh = new THREE.Mesh(Enemy._geometry, this.material);
        this.mesh.position.set(10, 1, 0);
        this.mesh.rotation.y = Math.PI * 0.5;
        // this.mesh.visible = false;

        getPhysicBody(this,{
            mass: 1000,
            type: 2,
        });
    }

    
    enemyVerticalMove(){
        const playerBody = Enemy.player.body;
        // console.log(playerBody.position.x);
        const enemyBody = this.body;
        console.log(enemyBody.position);
        let delta = this.clock.getDelta();
        let playerBodyZ = new THREE.Vector3(enemyBody.position.x, enemyBody.position.y, playerBody.position.z);
        enemyBody.position.copy(playerBodyZ);
    
       
      
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
        this.enemyVerticalMove();

    }
}