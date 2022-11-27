import {CylinderGeometry, Mesh, MeshBasicMaterial, Raycaster, Vector3} from 'three'
import Bullet from "../Bullet";
import Entity from "../Entity";
import {inInterval} from "../../../Utils/Utils";
import * as CANNON from "cannon-es";
import Enemy from "./Enemy";
import getPhysicBody from "../../../Utils/PhysicBody";
import BodyTypes from "../../../Utils/BodyTypes";
import bodyTypes from "../../../Utils/BodyTypes";

export default class Turret extends Entity {
    //GUI Attributes
    static _enemiesFolder;
    //SETTER Attributes
    static _geometry;
    //GAME Attributes
    _shootingDelay = 1;
    #cardinal = true;

    constructor()
    {
        super();
        // Debug
        if(this.debug.active)
        {
            if(!Turret._enemiesFolder){
                Turret._enemiesFolder = this.debug.ui.addFolder('Turret');
                Turret._enemiesFolder.close();
            }
        }

        if(!Turret._geometry){
            Turret._geometry = new CylinderGeometry(0.5,0.5,1,30,30)
        }

        this.#setMesh();
        this.scene.add(this._mesh)
    }

    shoot(){
        if( !document.hidden){
            if(this.#cardinal){
                new Bullet(this,{x:1,z:0});
                new Bullet(this,{x:-1,z:0});
                new Bullet(this,{x:0,z:1});
                new Bullet(this,{x:0,z:-1});
                this.#cardinal = false;
            }
            else{
                new Bullet(this,{x:1,z:1});
                new Bullet(this,{x:-1,z:1});
                new Bullet(this,{x:-1,z:-1});
                new Bullet(this,{x:1,z:-1});
                this.#cardinal = true;
            }

        }
    }

    #setMesh(){
        let filterGroup =  bodyTypes.OTHERS
        this._material = new MeshBasicMaterial();
        this._mesh = new Mesh(Turret._geometry, this._material);
        this._mesh.position.set(2, 1, 2);

        getPhysicBody(this,{
            mass: 0,
            collisionFilterGroup: filterGroup,
            type:2
        });
    }

    getShootingDelay(){
        return this._shootingDelay*1000;
    }


    getCardinal(){
        return this.#cardinal;
    }

    update()
    {
        if(this._body && this._mesh){
            this._mesh.position.copy(this._body.position)
            this._mesh.quaternion.copy(this._body.quaternion)
        }
    }
}