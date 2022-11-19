import {BoxGeometry,MeshBasicMaterial,Mesh} from 'three'
import getPhysicBody from "../../Utils/PhysicBody";
import EnemyVertical from "./Enemies/EnemyVertical";
import {Vec3} from "cannon-es";
import BodyTypes from "../../Utils/BodyTypes";
import Entity from "./Entity";
import EnemyHorizontal from "./Enemies/EnemyHorizontal";


export default class Bullet extends Entity {
    static bullets = [];
    static #bulletFolder;
    static #folderBulletSet = false;
    static #meshGlobal;
    static #force = 150;
    #toRemove = false;
    #eventCollider;
    #topPoint;
    #impulse;
    #orientation;
    #depthEnemy;
    #radiusEnemy;
    #widthThisMesh;
    _enemy = null; //Objet appartient à la classe Enemy

    constructor(_enemy,orientation = null)
    {
        super();
        this._enemy = _enemy;
        this.#orientation = orientation;

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
            collisionFilterMask:  BodyTypes.PLAYER | BodyTypes.OBSTACLES | BodyTypes.OTHERS,
            angularFactor: new Vec3(0,0,0)
        },'','bullet');
        this.#setImpulsion()
    }


    /**
     * Positionne le bullet à la position du lanceur et modifie son angle
     */
    #setOrigin(){
        const {x,y,z } = this._enemy.getMesh().position.clone();
        this.#depthEnemy = this._enemy.getMesh().geometry.parameters.depth/2;
        this.#widthThisMesh = this._mesh.geometry.parameters.width/2;
        this.#radiusEnemy = this._enemy.getMesh().geometry.parameters.radiusTop
        let posX;
        const posY = y
        let posZ;

        if(this._enemy instanceof EnemyVertical){
            posX = x - this.#depthEnemy - this.#widthThisMesh -0.1;
            posZ = z;
            this._mesh.rotation.z = Math.PI;
        }
        else if(this._enemy instanceof EnemyHorizontal){
            posX = x;
            posZ = z + this.#depthEnemy + this.#widthThisMesh +0.1;
            this._mesh.rotation.y = Math.PI/2;
        }
        else if(this.#orientation){
            const xFact = this.#orientation.x;
            const yFact = this.#orientation.z;
            //Factorisation Math 3eme
            posX = x + xFact * (this.#radiusEnemy+ this.#widthThisMesh + 0.1);
            posZ = z + yFact * (this.#radiusEnemy + this.#widthThisMesh + 0.1);
            this._mesh.rotation.y = Math.atan2(yFact,-xFact);
        }

        this._mesh.position.set(posX,posY,posZ);

    }


    #setImpulsion(){
        const widthThisMesh = this._mesh.geometry.parameters.width/2;
        const depthThisMesh = this._mesh.geometry.parameters.depth/2;

        this.#shootEnemies(widthThisMesh,depthThisMesh);
        this.#shootTurret(widthThisMesh,depthThisMesh);

        this._body.applyForce(this.#impulse,this.#topPoint)

        this.#eventCollider = this._body.addEventListener("collide", (e) => {
            if(e.body.collisionFilterGroup !== BodyTypes.BULLETS)
            this.#toRemove = true;

        })
    }

    #shootEnemies(widthThisMesh,depthThisMesh){
        if(this._enemy instanceof EnemyVertical){
            this.#topPoint = new Vec3(widthThisMesh, 0, 0)
            this.#impulse = new Vec3(-Bullet.#force/60,0 , 0)
        }
        else if (this._enemy instanceof EnemyHorizontal){
            this.#topPoint = new Vec3(0, 0, depthThisMesh)
            this.#impulse = new Vec3(0,0, Bullet.#force/60)
        }
    }

    #shootTurret(widthThisMesh,depthThisMesh){
        if(this.#orientation){
            const x = this.#orientation.x;
            const z = this.#orientation.z;
            this.#topPoint = new Vec3(widthThisMesh*x,0,depthThisMesh*z);
            this.#impulse = new Vec3((Bullet.#force/60)*x,0, (Bullet.#force/60)*z)
        }
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
