import Entity from "./Entity";
import {Mesh, PointLight, PointLightHelper, RectAreaLight, SpotLight, SpotLightHelper, Vector3} from "three";
import * as CANNON from "cannon-es";
import {concreteMaterial} from "../../Physic/Materials";
import keyObjects from "../../Utils/KeyObjets";
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper";


export default class LivingRoom extends Entity{
    #room
    #model
    tv

    constructor() {
        super();

        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Room')
            this.debugFolder.close();

        }
        this.#setMesh();
        this.#setBody()
    }

    #setModel() {
        this.#model = this.resources.items.livingRoomModel
        this.#room = this.#model.scene
        console.log(this.#room)

        this.#room.traverse((child) => {
            if (child instanceof Mesh && child.name != "Lampe" && child.name != "Ampoule") {
                child.receiveShadow = true
                child.castShadow = true;
            }
            if(child.name == "EcranTele")
                this.tv = child;
        })
        this.#room.children.forEach((child) =>{
            if(keyObjects.includes(child.name)){
                this.globalWorld.mouseHandler.addMesh(child)
            }
        })
    }


    #setMesh(){
        this.#setModel();
        this._mesh = this.#room


        this.pointLight = new PointLight("#ffbda1", 0)
        this.pointLight.position.set(41, 23,  -23.5)
        this.pointLight.castShadow = true
        this.pointLight.shadow.mapSize.set(1024, 1024)
        this.pointLight.shadow.normalBias = 0.05
        this._mesh.add(this.pointLight)

        this.rectAreaLight = new RectAreaLight("#92f5df", 0, 8, 6)
        this.rectAreaLight.position.set(32.6, 11, 9.65)
        this.rectAreaLight.rotation.y = 0.44
        this._mesh.add(this.rectAreaLight);


        this.spotLight = new SpotLight("#fabe4f", 200, 250, Math.PI * 0.1, 1, 1)
        this.spotLight.position.set(-15.54556655883789, 100, 8.173748016357422)
        this.spotLight.target.position.x = -15.54556655883789
        this.spotLight.target.position.y =  0
        this.spotLight.target.position.z =  8.173748016357422;
        // this.spotLight.castShadow = true
        // this.spotLight.shadow.mapSize.set(512, 512)
        // this.spotLight.shadow.normalBias = 0.05

        this._mesh.add(this.spotLight.target)
        this._mesh.add(this.spotLight)

        this._mesh.position.set(0,0,0)

        this.scene.add(this._mesh)


    }

    #setBody(){
        this._shape = new CANNON.Plane();
        this._body = new CANNON.Body();

        this._body.mass = 0;
        this._body.addShape(this._shape);
        this._body.material = concreteMaterial;
        this.world.addBody(this._body);
        this._body.position = new CANNON.Vec3(0,0,0)
        this._body.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
    }

    update(){

        const LightAngle =  this.time.delta
        this.spotLight.intensity = Math.cos(LightAngle) + Math.sin(LightAngle * 0.8) < 0.99 ? 200 : 0
    }
}