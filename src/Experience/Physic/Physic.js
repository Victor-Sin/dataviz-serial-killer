import * as THREE from 'three'
import Experience from '../Experience.js'
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger'


export default class Physic
{
    world;
    objectsToUpdate = [];
    toDestroy;
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.world = new CANNON.World();
        this.world.gravity.set(0,0,0);
        this.world.broadphase = new CANNON.SAPBroadphase(this.world)


        this.cannonDebugger = new CannonDebugger(this.scene, this.world, {
            // options...
        })

    }

    addObjectToUpdate(object){
        this.objectsToUpdate.push(object)
        return this.objectsToUpdate.length-1;
    }


    update(){
        this.world.step(1/60,this.experience.time.delta,3)
        for(const object of this.objectsToUpdate)
        {
            object.mesh.position.copy(object.body.position)
            object.mesh.quaternion.copy(object.body.quaternion)
        }
        this.cannonDebugger.update()
    }

}