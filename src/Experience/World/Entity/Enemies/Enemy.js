import {BoxGeometry,Raycaster,Vector3} from 'three'
import Bullet from "../Bullet";
import Entity from "../Entity";
import {inInterval} from "../../../Utils/Utils";
import * as CANNON from "cannon-es";

export default class Enemy extends Entity {
    //GUI Attributes
    static _enemiesFolder;
    static #folderEnemiesSet = false;
    //SETTER Attributes
    static _geometry;
    static _player;
    //GAME Attributes
    static #bombCooldown = 5;
    static #blocCooldown = 5;
    _force;
    _orientation;
    _shootingDelay;
    _isShooting = false;

    constructor()
    {
        super();
        // Debug
        if(this.debug.active)
        {
            if(!Enemy.#folderEnemiesSet){
                Enemy._enemiesFolder = this.debug.ui.addFolder('Enemies');
                Enemy._enemiesFolder.close();
                Enemy.#folderEnemiesSet = true;
                this.#setGuiGlobal();
            }
        }

        if(!Enemy._geometry){
            Enemy._geometry = new BoxGeometry(2,1,1)
        }
    }

    static shoot(enemy){
        if(enemy.getIsShooting() && !document.hidden){
            return new Bullet(enemy);
        }
    }

    static setPlayer(player){
        Enemy._player = player;
    }

    #setGuiGlobal(){
        Enemy._enemiesFolder.add(Enemy,'#bombCooldown',0,10,1)
        Enemy._enemiesFolder.add(Enemy,'#blocCooldown',0,10,1)
    }

    #enemyMove(){
        const playerBody = Enemy._player.getBody();
        const enemyBody = this._body;
        const delta =this.clock.getDelta()

        const moveDirection =
            playerBody.position[this._orientation] > enemyBody.position[this._orientation] ?
            1 : -1;

        const centerGravity = new CANNON.Vec3(0, 0, 0);
        let impulse = new CANNON.Vec3(0,0,0);

        const min = playerBody.position[this._orientation] -  0.75;
        const max = playerBody.position[this._orientation] +  0.75;

        impulse[this._orientation] = moveDirection * this._force * delta;

        //Arrête le mouvement si le joueur entre dans le raycast de l'ennemie
        const pointColision = this._body.position[this._orientation];
        if(inInterval(pointColision,min,max)){
            enemyBody.velocity = new CANNON.Vec3(0,0,0);
            this._isShooting = true;
        }
        else{
            setTimeout(() => {
                this._isShooting = false;
                enemyBody.applyImpulse(impulse,centerGravity);
            },this._isShooting ? this.getShootingDelay()*3 : 0)
        }
    }

    getShootingDelay(){
        return this._shootingDelay*1000;
    }

    getIsShooting(){
        return this._isShooting;
    }

    update()
    {
        if(this._body && this._mesh){
            this._mesh.position.copy(this._body.position)
            this._mesh.quaternion.copy(this._body.quaternion)
            this.#enemyMove()
        }

    }
}