import {BoxGeometry,MeshBasicMaterial,Mesh} from 'three'
import getPhysicBody from "../../Utils/PhysicBody";
import EnemyVertical from "./Enemies/EnemyVertical";
import {Vec3} from "cannon-es";
import BodyTypes from "../../Utils/BodyTypes";
import Entity from "./Entity";


export default class Bullet extends Entity {
    static bullets = [];
    static #bulletFolder;
    static #folderBulletSet = false;
    static #meshGlobal;
    static #force = 300;
    #toRemove = false;
    #eventCollider;
    _enemy = null; //Objet appartient à la classe Enemy

    constructor(_enemy)
    {
        super();
        this._enemy = _enemy;

        this.#setMesh();

        // Debug
        if(this.debug.active)
        {
            if(!Bullet.#folderBulletSet) {
                Bullet.#bulletFolder = this.debug.ui.addFolder('bullets');
                Bullet.#folderBulletSet = true;
                this.#setGui();
            }
        }

        Bullet.bullets.push(this)

        this.scene.add(this._mesh)
    }

    #setGui(){
        Bullet.#bulletFolder.add(Bullet,'#force',0,10,1)
        Bullet.#bulletFolder.add(this._mesh.position,"x",-15,15,0.1)
        Bullet.#bulletFolder.add(this._mesh.position,"y",-15,15,0.1)
        Bullet.#bulletFolder.add(this._mesh.position,"z",-15,15,0.1)

    }

    #setMesh(){
        if(!Bullet.#meshGlobal){
            const geometry = new BoxGeometry(0.75,0.25,0.25);
            const material = new MeshBasicMaterial();
            Bullet.#meshGlobal = new Mesh(geometry, material);
        }
        this._mesh = Bullet.#meshGlobal.clone();
        this.#setOrigin();

        this.index = getPhysicBody(this,{
            mass: 0.01,
            collisionFilterGroup: BodyTypes.BULLETS,
            collisionFilterMask:  BodyTypes.PLAYER | BodyTypes.OBSTACLES | BodyTypes.OTHERS
        },'','bullet');
        this.#setImpulsion()
    }


    /**
     * Positionne le bullet à la position du lanceur et modifie son angle
     */
    #setOrigin(){
        const {x,y,z } = this._enemy.getMesh().position.clone();
        const depthEnemy = this._enemy.getMesh().geometry.parameters.depth/2;
        const widthThisMesh = this._mesh.geometry.parameters.width/2;
        const posX = this._enemy instanceof EnemyVertical ? x - depthEnemy - widthThisMesh -0.1   : x;
        const posY = y
        const posZ = this._enemy instanceof EnemyVertical ? z  : z + depthEnemy + widthThisMesh +0.1;



        this._mesh.position.set(posX,posY,posZ);

        if(this._enemy instanceof EnemyVertical){
            this._mesh.rotation.z = Math.PI;
        }
        else{
            this._mesh.rotation.y = Math.PI/2;
        }
    }

    #setImpulsion(){
        const widthThisMesh = this._mesh.geometry.parameters.width/2;
        const depthThisMesh = this._mesh.geometry.parameters.depth/2;
        let topPoint;
        let impulse;
        if(this._enemy instanceof EnemyVertical){
             topPoint = new Vec3(widthThisMesh, 0, 0)
             impulse = new Vec3(-Bullet.#force/60,0 , 0)
        }
        else{
             topPoint = new Vec3(0, 0, depthThisMesh)
             impulse = new Vec3(0,0, Bullet.#force/60)
        }
        this._body.applyForce(impulse,topPoint)

        this.#eventCollider = this._body.addEventListener("collide", (e) => {
            if(e.body.collisionFilterGroup !== BodyTypes.BULLETS)
            this.#toRemove = true;

        })

    }

    update()
    {
        if(this._body && this._mesh && !this.#toRemove){
            this._mesh.position.copy(this._body.position)
            this._mesh.quaternion.copy(this._body.quaternion)
        }
        if(this.#toRemove){
            this.world.removeBody(this._body);
            this._body.removeEventListener('collide',this.#eventCollider)

            this.scene.remove(this._mesh)
            this._mesh.material.dispose()
            this._mesh.geometry.dispose()
        }

    }
}
