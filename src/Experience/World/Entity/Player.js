import {BoxGeometry,MeshBasicMaterial,Mesh} from 'three'
import getPhysicBody from "../../Utils/PhysicBody";
import {Vec3} from "cannon-es";
import THREEx from "../../Utils/keyboard";
import BodyTypes from "../../Utils/BodyTypes";
import Entity from "./Entity";

export default class Player extends Entity {
    #dashCooldown = 5;
    #health = 4;
    #velocity = 1000;
    #debugFolder;


    constructor() {
        super();
        this.keyboard = new THREEx.KeyboardState();

        this.#setMesh();

        // Debug
        if (this.debug.active) {
            this.#debugFolder = this.debug.ui.addFolder('Player');
            this.#debugFolder.close();
            this.#setGui();

        }

        this.scene.add(this._mesh)
        this.#setPlayerController()
    }

    #setMesh() {

        this._geometry = new BoxGeometry(1.5, 2, 1.5);
        this._material = new MeshBasicMaterial();
        this._mesh = new Mesh(this._geometry, this._material);
        this._mesh.position.set(0, 1.5, 0);

        getPhysicBody(this, {
            mass:40,
            fixedRotation : true,
            linearDamping : 0.85,
            collisionFilterGroup: BodyTypes.PLAYER,
            collisionFilterMask: BodyTypes.BULLETS | BodyTypes.OTHERS

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
    
    #setPlayerController() {

        let delta = this.clock.getDelta();
        let moveDistance = this.#velocity * delta;
        let topPoint = new Vec3(0, 0, 0);
        let impulse;


        if (this.keyboard.pressed("left") || this.keyboard.pressed("q")) {
            impulse = new Vec3(-moveDistance,0, 0)
            this._body.applyImpulse(impulse,topPoint)
        }
        if (this.keyboard.pressed("right") || this.keyboard.pressed("d")) {
            impulse = new Vec3(moveDistance,0, 0)
            this._body.applyImpulse(impulse,topPoint)
        }
        if (this.keyboard.pressed("up") || this.keyboard.pressed("z")) {
            impulse = new Vec3(0,0, -moveDistance)
            this._body.applyImpulse(impulse,topPoint)
        }
        if (this.keyboard.pressed("down") || this.keyboard.pressed("s")) {
            impulse = new Vec3(0,0, moveDistance)
            this._body.applyImpulse(impulse,topPoint)
        }
    }

    update() {
        if (this._body && this._mesh) {
            this._mesh.position.copy(this._body.position)
            this._mesh.quaternion.copy(this._body.quaternion)

        }
        this.#setPlayerController()
    }
}