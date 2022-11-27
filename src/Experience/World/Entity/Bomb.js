import {Vector3,CircleGeometry,MeshBasicMaterial,Mesh} from 'three'
import {Body,Cylinder,Vec3} from "cannon-es";
import BodyTypes from "../../Utils/BodyTypes";
import Entity from "./Entity";
import { gsap } from "gsap";


export default class Bomb extends Entity {
    static #areaMeshGlobal;
    static #delayMeshGlobal;
    static bombs = [];
    #toRemove = false;
    #eventCollider = null;

    #areaMesh;
    #delayMesh;
    #maxRadius = 3.75;
    #position;

    constructor(position = new Vector3(),)
    {
        super();

        this.#position = position
        // Debug
        if(this.debug.active)
        {

        }

        Bomb.bombs.push(this)

        this.#setMesh(position);
        this.scene.add(this.#areaMesh)
        this.scene.add(this.#delayMesh)



        this.#launchAnimation()

    }

    #launchAnimation(){
        let anim = gsap.timeline({
            onComplete: () => {
                this.#setBody(this.#position)
                this.world.addBody(this._body);
                this.#removeMeshes();

                this.#eventCollider = this._body.addEventListener("collide", (e) => {
                   
                    console.log(e.body.collisionFilterGroup, e.body.collisionFilterGroup === BodyTypes.PLAYER)
                })
                setTimeout(() => {
                    this.#toRemove = true;
                },250)
            }
        })


        anim.from(this.#delayMesh.scale,{
            x: 0,
            y: 0,
            z: 0,
        })
        anim.to(this.#delayMesh.scale,{
            x: 1,
            y: 1,
            z: 1,
            duration: 2,
            ease: "power2.easeOut"
        })
    }

    #setMesh(position){
        if(!Bomb.#areaMeshGlobal){
            const geometry = new CircleGeometry(this.#maxRadius,30);
            const material = new MeshBasicMaterial({
                color: 0xed6112,
                transparent: true,
                alphaTest: 0,
                opacity: 0.5
            });
            Bomb.#areaMeshGlobal = new Mesh(geometry, material);
            Bomb.#delayMeshGlobal = new Mesh(geometry, material);
            Bomb.#delayMeshGlobal.scale.set(0,0,0)
        }

        this.#areaMesh = Bomb.#areaMeshGlobal.clone();
        this.#areaMesh.position.set(position.x, 0.05, position.z);
        this.#areaMesh.rotation.x = - Math.PI * 0.5;

        this.#delayMesh = Bomb.#delayMeshGlobal.clone();
        this.#delayMesh.position.set(position.x,0.075,position.z);
        this.#delayMesh.rotation.x = - Math.PI * 0.5;
    }

    #setBody(position){
        this._shape = new Cylinder(this.#maxRadius,this.#maxRadius,2,30)
        this._body =  new Body({
            mass: 0,
            position: new Vec3(position.x,1,position.z),
            shape : this._shape,
            isTrigger: true,
            collisionFilterGroup: BodyTypes.BOMBS,
            collisionFilterMask: BodyTypes.PLAYER | BodyTypes.OBSTACLES,
            collisionResponse: false,

        })
    }

    #removeMeshes(){
        this.#areaMesh.material.dispose()
        this.#areaMesh.geometry.dispose()
        this.scene.remove(this.#areaMesh)

        this.#delayMesh.material.dispose()
        this.#delayMesh.geometry.dispose()
        this.scene.remove(this.#delayMesh)
    }

    update()
    {
        if(this.#toRemove){
            this.world.removeBody(this._body);
            this._body.removeEventListener('collide',this.#eventCollider)
        }
    }
}