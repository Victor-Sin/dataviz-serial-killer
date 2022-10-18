import * as THREE from 'three'
import Experience from '../../Experience'
import Enemy from "./Enemies/Enemy";
import getPhysicBody from "../../Utils/PhysicBody";
import EnemyVertical from "./Enemies/EnemyVertical";

export default class Bullet
{
    static bulletFolder;
    static meshGlobal;
    static force = 0.1;
    mesh ;
    enemy = null; //Objet appartient à la classe Enemy

    constructor(enemy = false)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.world = this.experience.physic.world

        this.enemy = enemy;

        // Debug
        if(this.debug.active)
        {
            if(!Bullet.bulletFolder) {
                Bullet.bulletFolder = this.debug.ui.addFolder('bullets');
                this.setGui();
            };
        }

        this.setMesh();

        console.log(this.mesh)
        this.scene.add(this.mesh)
    }

    setGui(){
        Bullet.bulletFolder.add(Bullet,'force',0,10,1)
    }

    setMesh(){
        if(!Bullet.meshGlobal){
            const geometry = new THREE.BoxGeometry(0.75,0.25,0.25);
            const material = new THREE.MeshBasicMaterial();
            Bullet.meshGlobal = new THREE.Mesh(geometry, material);
        }
        this.mesh = Bullet.meshGlobal.clone();
        this.setOrigin();
        getPhysicBody(this);
    }


    /**
     * Positionne le bullet à la position du lanceur et modifie son angle
     */
    setOrigin(){
        this.mesh.position.set(this.enemy.mesh.position.clone());
        this.mesh.rotation.x = Math.PI/2;

        if(this.enemy instanceof EnemyVertical){
            this.mesh.rotation.z = Math.PI;
        }
        else{
            this.mesh.rotation.z = Math.PI/2;
        }

    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}