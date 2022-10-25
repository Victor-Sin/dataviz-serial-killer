import * as THREE from 'three'
import Enemy from "./Enemy";
import * as CANNON from "cannon-es";
import getPhysicBody from "../../../Utils/PhysicBody";
import { Clock } from 'three';

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
            if(Enemy.enemiesFolder)  this.debugFolder  = Enemy.enemiesFolder.addFolder('EnemyHorizontal');
            this.debugFolder.close();
            this.setGui()
        }
        this.clock = new THREE.Clock();
        this.setMesh();
        this.enemyHorizontalMove();

        this.scene.add(this.mesh)
        // setTimeout( () => this.shoot(this),this.shootingDelay*1000)
    }

    enemyHorizontalMove(){
        const playerBody = Enemy.player.body;
        console.log(playerBody.position.x);
        const enemyBody = this.body;
        let delta = this.clock.getDelta();
        let playerBodyX = new THREE.Vector3(playerBody.position.x, enemyBody.position.y, enemyBody.position.z);
        enemyBody.position.copy(playerBodyX);
        // console.log(enemyBody.position);
    
       
      
    }

    setMesh(){
        this.material = new THREE.MeshBasicMaterial();
        this.mesh = new THREE.Mesh(Enemy._geometry, this.material);
        this.mesh.position.set(0, 1, -10);
        // this.mesh.visible = false;


        getPhysicBody(this,{
            mass: 1000,
            type: 2,
            collisionFilterGroup: 3,
            collisionFilterMask: 4,

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
        this.enemyHorizontalMove();
    }
}