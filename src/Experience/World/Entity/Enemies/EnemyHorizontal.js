import {MeshBasicMaterial,Mesh} from 'three'
import Enemy from "./Enemy";
import getPhysicBody from "../../../Utils/PhysicBody";
import BodyTypes from "../../../Utils/BodyTypes";

export default class EnemyHorizontal extends Enemy
{
    _shootingDelay = 0.25;
    _orientation = 'x';
    _force = 400;
    #debugFolder;

    constructor()
    {
        super();
        // Debug
        if(this.debug.active)
        {
            if(Enemy._enemiesFolder)  this.#debugFolder  = Enemy._enemiesFolder.addFolder('EnemyHorizontal');
            this.#debugFolder.close();
            this.#setGui()
        }
        this.#setMesh();
        this.scene.add(this._mesh)
        this._initRayCaster()

    }


    #setMesh(){
        this._material = new MeshBasicMaterial();
        this._mesh = new Mesh(Enemy._geometry, this._material);
        this._mesh.position.set(5, 1, -10);

        getPhysicBody(this,{
            mass: 35,
            collisionFilterMask:  BodyTypes.NONE,
            linearDamping : 0.25,
        });
    }

    #setGui(){
        if(this.#debugFolder){
            this.#debugFolder.add(this,'_force',0,10,0.1)
            this.#debugFolder.add(this,'_shootingDelay',0,5,0.01);
        }
    }

    update()
    {
        super.update();

    }
}