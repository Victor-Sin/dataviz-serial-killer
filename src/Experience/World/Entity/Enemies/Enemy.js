import * as THREE from 'three'
import Bullet from "../Bullet";
import Entity from "../Entity";
import {inInterval, lerp} from "../../../Utils/Utils";
import * as CANNON from "cannon-es";

export default class Enemy extends Entity {
    //GUI Attributes
    static enemiesFolder;
    static folderEnemiesSet = false;
    //SETTER Attributes
    static geometry;
    static player;
    //GAME Attributes
    static bombCooldown = 5;
    static blocCooldown = 5;
    force = 100;
    mesh;
    material;
    orientation;
    shootingDelay;
    raycaster;
    intersections;

    constructor()
    {
        super();
        // Debug
        if(this.debug.active)
        {
            if(!Enemy.folderEnemiesSet){
                Enemy.enemiesFolder = this.debug.ui.addFolder('Enemies');
                Enemy.enemiesFolder.close();
                Enemy.folderEnemiesSet = true;
                this.setGuiGlobal();
            };
        }

        if(!Enemy._geometry){
            Enemy._geometry = new THREE.BoxGeometry(2,1,1)
        }
        this.raycaster = new THREE.Raycaster()


    }

    initRayCaster(){
        const rayOrigin = this.mesh.position
        const rayDirection = new THREE.Vector3(0, 0, 0)
        const directionShoot =
            this.orientation === 'z' ? 'x' : 'z'
        rayDirection[directionShoot] =
            this.orientation === 'z' ?  -10 : 10

        rayDirection.normalize()

        this.raycaster.set(rayOrigin, rayDirection)
        // this.intersections = this.raycaster.intersectObject(Enemy.player.mesh)

    }


    setGuiGlobal(){
        Enemy.enemiesFolder.add(Enemy,'bombCooldown',0,10,1)
        Enemy.enemiesFolder.add(Enemy,'blocCooldown',0,10,1)
    }

    static shoot(enemy){
        return new Bullet(enemy);
    }

    static setPlayer(player){
        this.player = player;

    }

    enemyMove(){
        const playerBody = Enemy.player.body;
        const enemyBody = this.body;
        const delta =this.clock.getDelta()
        const moveDirection =
            playerBody.position[this.orientation] > enemyBody.position[this.orientation] ?
            1 : -1;

        const centerGravity = new CANNON.Vec3(0, 0, 0);
        let impulse = new CANNON.Vec3(0,0,0);

        const min = playerBody.position[this.orientation] -  0.1;
        const max = playerBody.position[this.orientation] +  0.1

        impulse[this.orientation] = moveDirection * this.force * delta;

        if(this.intersections.length > 0 ){
            const pointColision = this.intersections[0].point[this.orientation];
            if(inInterval(pointColision,min,max))
            enemyBody.velocity = new CANNON.Vec3(0,0,0);
        }
        else{
            enemyBody.applyImpulse(impulse,centerGravity);
        }
    }

    getShootingDelay(){
        return this.shootingDelay*1000;
    }

    update()
    {
        if(this.body && this.mesh){
            this.mesh.position.copy(this.body.position)
            this.mesh.quaternion.copy(this.body.quaternion)

            if(Enemy.player){
                this.intersections = this.raycaster.intersectObject(Enemy.player.mesh)
            }
            this.raycaster.ray.origin.copy(this.body.position)

            this.enemyMove()

        }

    }
}