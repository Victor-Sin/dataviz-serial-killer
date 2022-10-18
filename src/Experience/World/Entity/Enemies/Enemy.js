import * as THREE from 'three'
import Experience from '../../../Experience'
import Bullet from "../Bullet";

export default class Enemy
{
    static bombCooldown = 5;
    static blocCooldown = 5;
    static enemiesFolder;
    static folderEnemiesSet = false;
    static geometry;
    force = 5;
    mesh;
    material;

    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.world = this.experience.physic.world;
        this.physic = this.experience.physic;


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

    shoot(){
        const bullet = new Bullet(this);
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}