import * as THREE from 'three'
import Experience from '../../Experience'
import getPhysicBody from "../../Utils/PhysicBody";
import * as CANNON from "cannon-es";
import THREEx from "../../Utils/keyboard";
import BodyTypes from "../../Utils/BodyTypes";
import Entity from "./Entity";

console.log(THREEx);
export default class Player extends Entity {
    dashCooldown = 5;
    health = 4;
    velocity = 1000;

    constructor() {
        super();
        this.keyboard = new THREEx.KeyboardState();

        this.setMesh();

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Player');
            this.debugFolder.close();
            this.setGui();

        }


        this.scene.add(this.mesh)
        this.setPlayerController()
    }

    setMesh() {

        this.geometry = new THREE.SphereGeometry(1.5, 50, 50);
        this.material = new THREE.MeshBasicMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 1.5, 0);

        getPhysicBody(this, {
            mass:40,
            fixedRotation : true,
            linearDamping : 0.85,
            collisionFilterGroup: BodyTypes.PLAYER,
            collisionFilterMask: BodyTypes.BULLETS | BodyTypes.OTHERS

        });

    }
    setGui() {
        if (this.debugFolder) {
            //add position
            this.debugFolder.add(this.body.position, 'x', -10, 10, 0.01)
            this.debugFolder.add(this.body.position, 'y', -10, 10, 0.01)
            this.debugFolder.add(this.body.position, 'z', -10, 10, 0.01)
            this.debugFolder.add(this, 'velocity', 0, 15, 0.01)
        }
    }
    
    setPlayerController() {

        let delta = this.clock.getDelta();
        let moveDistance = this.velocity * delta;
        let topPoint = new CANNON.Vec3(0, 0, 0);
        let impulse;


        if (this.keyboard.pressed("left") || this.keyboard.pressed("q")) {
            impulse = new CANNON.Vec3(-moveDistance,- 9.82*delta, 0)
            this.body.applyImpulse(impulse,topPoint)
        }
        if (this.keyboard.pressed("right") || this.keyboard.pressed("d")) {
            impulse = new CANNON.Vec3(moveDistance,- 9.82*delta, 0)
            this.body.applyImpulse(impulse,topPoint)
        }
        if (this.keyboard.pressed("up") || this.keyboard.pressed("z")) {
            impulse = new CANNON.Vec3(0,- 9.82*delta, -moveDistance)
            this.body.applyImpulse(impulse,topPoint)
        }
        if (this.keyboard.pressed("down") || this.keyboard.pressed("s")) {
            impulse = new CANNON.Vec3(0,- 9.82*delta, moveDistance)
            this.body.applyImpulse(impulse,topPoint)
        }
    }

    update() {
        if (this.body && this.mesh) {
            this.mesh.position.copy(this.body.position)
            this.mesh.quaternion.copy(this.body.quaternion)

        }

        this.setPlayerController()
    }
}