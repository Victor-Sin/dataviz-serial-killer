import { Mesh, CylinderGeometry,MeshStandardMaterial, SpotLight} from 'three'
import getPhysicBody from "../../Utils/PhysicBody";

import Entity from "./Entity";
import {plasticMaterial} from "../../Physic/Materials";

export default class Player extends Entity {
    lightOn = false;
    disabled = false;
    #debugFolder;


    constructor(position,name = "") {
        super();
        this.#setMesh(position,name);
        this.#setSpotlight()

        // Debug
        if (this.debug.active) {
            this.#debugFolder = this.debug.ui.addFolder('Player');
            this.#debugFolder.close();
            this.#setGui();

        }
        this.scene.add(this._mesh)
    }


    #setSpotlight(){
        this.spotLight = new SpotLight("#ce7946", 1, 100, Math.PI * 0.1, 0.25, 0.25)
        this.spotLight.position.set(this._mesh.position.x, 25, this._mesh.position.z)
        this.spotLight.penumbra = 0.75;
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 1024;
        this.spotLight.shadow.mapSize.height = 1024;
        this.spotLight.shadowMapVisible = true;
        this.spotLight.target = this._mesh
        this.scene.add(this.spotLight)
    }



    #setMesh(position,name) {

        const {x,y,z} = position;

        this._geometry = new CylinderGeometry( 1.5, 1.5, 1.5, 32 );
        this._material = new MeshStandardMaterial();
        this._mesh = new Mesh(this._geometry,this._material);
        this._mesh.castShadow = true;

        this._mesh.position.set(x,y,z);
        this._mesh.rotation.x = ((Math.random()-0.5)*2) * Math.random()*Math.PI/3;
        this._mesh.name = name


        getPhysicBody(this, {
            mass: 40,
            material: plasticMaterial
        });
    }

    #setGui() {
        if (this.#debugFolder) {
            //add position
            this.#debugFolder.add(this._body.position, 'x', -10, 10, 0.01)
            this.#debugFolder.add(this._body.position, 'y', -10, 10, 0.01)
            this.#debugFolder.add(this._body.position, 'z', -10, 10, 0.01)
            this.#debugFolder.add(this, '#velocity', 0, 15, 0.01)
        }
    }


    update() {
        if (this._body && this._mesh) {
            this._mesh.position.copy(this._body.position)
            this._mesh.quaternion.copy(this._body.quaternion)
        }
    }
}