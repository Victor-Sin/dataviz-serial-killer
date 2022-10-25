import * as THREE from 'three'
import Experience from '../../Experience'
import Enemy from "./Enemies/Enemy";
import getPhysicBody from "../../Utils/PhysicBody";
import EnemyVertical from "./Enemies/EnemyVertical";
import * as CANNON from "cannon-es";


export default class Bullet
{
    static bullets = [];
    static bulletFolder;
    static folderBulletSet = false;
    static meshGlobal;
    static force = 200;
    toRemove = false;
    mesh ;
    enemy = null; //Objet appartient à la classe Enemy
    body;
    shape;

    constructor(enemy = false)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.world = this.experience.physic.world
        this.physic = this.experience.physic


        this.enemy = enemy;

        this.setMesh();

        // Debug
        if(this.debug.active)
        {
            if(!Bullet.folderBulletSet) {
                Bullet.bulletFolder = this.debug.ui.addFolder('bullets');
                Bullet.folderBulletSet = true;
                this.setGui();
            };
        }

        Bullet.bullets.push(this)

        this.scene.add(this.mesh)
    }

    setGui(){
        Bullet.bulletFolder.add(Bullet,'force',0,10,1)
        Bullet.bulletFolder.add(this.mesh.position,"x",-15,15,0.1)
        Bullet.bulletFolder.add(this.mesh.position,"y",-15,15,0.1)
        Bullet.bulletFolder.add(this.mesh.position,"z",-15,15,0.1)

    }

    setMesh(){
        if(!Bullet.meshGlobal){
            const geometry = new THREE.BoxGeometry(0.75,0.25,0.25);
            const material = new THREE.MeshBasicMaterial();
            Bullet.meshGlobal = new THREE.Mesh(geometry, material);
        }
        this.mesh = Bullet.meshGlobal.clone();
        this.setOrigin();

        this.index = getPhysicBody(this,{
            mass: 0.01,
            collisionFilterGroup: 1,
            collisionFilterMask: 2
        },'','bullet');
        this.setImpulsion()
    }


    /**
     * Positionne le bullet à la position du lanceur et modifie son angle
     */
    setOrigin(){
        const {x,y,z } = this.enemy.mesh.position.clone();
        const depthEnemy = this.enemy.mesh.geometry.parameters.depth/2;
        const widthThisMesh = this.mesh.geometry.parameters.width/2;
        const posX = this.enemy instanceof EnemyVertical ? x - depthEnemy - widthThisMesh -0.1   : x;
        const posY = y
        const posZ = this.enemy instanceof EnemyVertical ? z  : z + depthEnemy + widthThisMesh +0.1;



        this.mesh.position.set(posX,posY,posZ);

        if(this.enemy instanceof EnemyVertical){
            this.mesh.rotation.z = Math.PI;
        }
        else{
            this.mesh.rotation.y = Math.PI/2;
        }
    }

    setImpulsion(){
        const widthThisMesh = this.mesh.geometry.parameters.width/2;
        const depthThisMesh = this.mesh.geometry.parameters.depth/2;
        let topPoint;
        let impulse;
        if(this.enemy instanceof EnemyVertical){
             topPoint = new CANNON.Vec3(widthThisMesh, 0, 0)
             impulse = new CANNON.Vec3(-Bullet.force*1/60,0 , 0)
        }
        else{
             topPoint = new CANNON.Vec3(0, 0, depthThisMesh)
             impulse = new CANNON.Vec3(0,0, Bullet.force*1/60)
        }
        this.body.applyForce(impulse,topPoint)

        this.eventCollider = this.body.addEventListener("collide", (e) => {
            // console.log(e.contact.bj.material.name)

            if(e.contact.bj.material.name !== 'bullet')
            this.toRemove = true;

        })

    }

    update()
    {
        if(this.body && this.mesh && !this.toRemove){
            this.mesh.position.copy(this.body.position)
            this.mesh.quaternion.copy(this.body.quaternion)
        }
        if(this.toRemove){
            this.world.removeBody(this.body);
            this.body.removeEventListener('collide',this.eventCollider)

            this.scene.remove(this.mesh)
            this.mesh.material.dispose()
            this.mesh.geometry.dispose()
        }

    }
}