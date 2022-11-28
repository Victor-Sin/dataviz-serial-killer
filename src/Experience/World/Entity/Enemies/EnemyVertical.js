import {Mesh,MeshBasicMaterial} from 'three'
import Enemy from "./Enemy";
import getPhysicBody from "../../../Utils/PhysicBody";
import BodyTypes from "../../../Utils/BodyTypes";

export default class EnemyVertical extends Enemy
{
    _shootingDelay = 0.15;
    _orientation = 'z';
    _force = 50;
    #debugFolder;

    constructor(name)
    {
        super(name);

        // Debug
        if(this.debug.active)
        {
            if(Enemy._enemiesFolder)  this.#debugFolder = Enemy._enemiesFolder.addFolder('EnemyVertical');
            this.#debugFolder.close();

            this.#setGui();

        }

        this.#setMesh();
        this.scene.add(this._mesh)

    }

    #setMesh(){
        this._material = new MeshBasicMaterial();
        this._mesh = new Mesh(Enemy._geometry, this._material);
        this._mesh.position.set(10, 1, 0);
        this._mesh.rotation.y = Math.PI * 0.5;

        getPhysicBody(this,{
            mass: 35,
            collisionFilterMask:  BodyTypes.NONE,
            linearDamping : 0.1,
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