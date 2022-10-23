import * as THREE from 'three'
import Experience from '../../Experience'
import getPhysicBody from "../../Utils/PhysicBody";
import * as CANNON from "cannon-es";
import { Clock } from 'three';
import THREEx from "../../Utils/keyboard";

console.log(THREEx);
export default class Player {
    dashCooldown = 5;
    health = 4;

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.world = this.experience.physic.world
    
        this.clock = new THREE.Clock();
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

        this.geometry = new THREE.BoxGeometry(1.5, 1.75, 1.5);
        this.material = new THREE.MeshBasicMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 1, 0);

        getPhysicBody(this, 1);

    }
    setGui() {
        if (this.debugFolder) {
            //add position
            this.debugFolder.add(this.body.position, 'x', -10, 10, 0.01)
            this.debugFolder.add(this.body.position, 'y', -10, 10, 0.01)
            this.debugFolder.add(this.body.position, 'z', -10, 10, 0.01)
        }
    }
    
    setPlayerController() {
        let delta = this.clock.getDelta();
        let moveDistance = 12 * delta;

        if (this.keyboard.pressed("left") || this.keyboard.pressed("q")) {
            this.body.position.x -= moveDistance;
        }
        if (this.keyboard.pressed("right") || this.keyboard.pressed("d")) {
            this.body.position.x += moveDistance;   
        }
        if (this.keyboard.pressed("up") || this.keyboard.pressed("z")) {
            this.body.position.z -= moveDistance;
        }
        if (this.keyboard.pressed("down") || this.keyboard.pressed("s")) {
            this.body.position.z += moveDistance;
        }


    
        // document.addEventListener('keydown', (event) => {
        //     switch (event.key) {
        //         case 'ArrowUp':
        //         case 'z':
        //             this.body.position.z -= moveDistance;
        //             break;
        //         case 'ArrowDown':
        //         case 's':
        //             this.body.position.z += moveDistance;
        //             break;
        //         case 'ArrowLeft':
        //         case 'q':
        //             this.body.position.x -= moveDistance;
        //             break;
        //         case 'ArrowRight':
        //         case 'd':
        //             this.body.position.x += moveDistance;
        //             break;

        //         default:
        //             break;
        //     }
        // });




    }

    update() {
        if (this.body && this.mesh) {
            this.mesh.position.copy(this.body.position)
            this.mesh.quaternion.copy(this.body.quaternion)

        }

        this.setPlayerController()
    }
}