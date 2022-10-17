import * as THREE from 'three'
import Experience from '../../../Experience'
import Bullet from "../Bullet";

export default class Enemy
{
    static bombCooldown = 5;
    static blocCooldown = 5;
    static enemiesFolder;
    static geometry;
    static force = 5;
    mesh;
    material;

    constructor(name)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug


        // Debug
        if(this.debug.active)
        {
            if(!Enemy.enemiesFolder){
                Enemy.enemiesFolder = this.debug.ui.addFolder('enemies');
                this.setGui();
            };
        }

        if(!Enemy._geometry){
            Enemy._geometry = new THREE.BoxBufferGeometry(2,1,1)
        }
    }

    setGui(){
        Enemy.enemiesFolder.add(Enemy,'bombCooldown',0,10,1)
        Enemy.enemiesFolder.add(Enemy,'blocCooldown',0,10,1)
        Enemy.enemiesFolder.add(this,'force',0,10,0.1)
    }

    shoot(){
        const bullet = new Bullet(this);
        this.experience.scene.add(bullet)
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}