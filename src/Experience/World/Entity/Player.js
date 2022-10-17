import * as THREE from 'three'
import Experience from '../../Experience'
import Enemy from "./Enemies/Enemy";

export default class Bullet
{
    dashCooldown = 5;
    mesh = null;

    constructor(enemy = false)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug


        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Player');
        }

        this.setMesh();
        this.setOrigin();

        this.scene.add(this.mesh)
    }

    setMesh(){
        if(Bullet.meshGlobal){
            this.mesh = Bullet.meshGlobal.clone();
        }
        else{
            const geometry = new THREE.PlaneGeometry(1,0.2);
            const material = new THREE.MeshBasicMaterial();
            material.side = THREE.DoubleSide;
            Bullet.meshGlobal = new THREE.Mesh(geometry, material);
            this.mesh = Bullet.meshGlobal.clone();
        }
    }


    /**
     * Positionne le bullet à la position du lanceur et modifie son angle
     */
    setOrigin(){
        this.mesh.position.set(this.enemy.position);
        this.mesh.rotation.x = Math.PI/2;

        if(this.enemy instanceof Enemy){
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