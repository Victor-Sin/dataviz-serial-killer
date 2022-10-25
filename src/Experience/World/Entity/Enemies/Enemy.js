import * as THREE from 'three'
import Bullet from "../Bullet";
import Entity from "../Entity";

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
    force = 5;
    mesh;
    material;
    orientation;
    shootingDelay;

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

    }


    setGuiGlobal(){
        Enemy.enemiesFolder.add(Enemy,'bombCooldown',0,10,1)
        Enemy.enemiesFolder.add(Enemy,'blocCooldown',0,10,1)
    }

    static shoot(enemy){
        return new Bullet(enemy);
    }

    static  setPlayer(player){
        this.player = player;
    }

    enemyMove(){
        const playerBodyPosition = Enemy.player.body.position;
        const enemyBodyPosition = this.body.position;
        enemyBodyPosition[this.orientation] = playerBodyPosition[this.orientation];
    }

    getShootingDelay(){
        return this.shootingDelay*1000;
    }

    update()
    {
        if(this.body && this.mesh){
            this.mesh.position.copy(this.body.position)
            this.mesh.quaternion.copy(this.body.quaternion)
            // this.enemyMove()
        }
    }
}