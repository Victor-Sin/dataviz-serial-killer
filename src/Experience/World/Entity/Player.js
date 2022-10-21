import * as THREE from 'three'
import Experience from '../../Experience'
import getPhysicBody from "../../Utils/PhysicBody";


export default class Player
{
    dashCooldown = 5;
    health= 4;

    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.world = this.experience.physic.world

        this.setMesh();
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Player');
            this.debugFolder.close();
            this.setGui();

        }


        this.scene.add(this.mesh)
    }

    setMesh(){

        this.geometry = new THREE.BoxGeometry(1.5,1.75,1.5);
        this.material = new THREE.MeshBasicMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 1, 0);

        getPhysicBody(this,100000000);

    }
    setGui(){
        if(this.debugFolder){
            //add position
            this.debugFolder.add(this.mesh.position,'x',-10,10,0.01)
            this.debugFolder.add(this.mesh.position,'y',-10,10,0.01)
            this.debugFolder.add(this.mesh.position,'z',-10,10,0.01)
        }
    }

    update()
    {
        if(this.body && this.mesh){
            this.mesh.position.copy(this.body.position)
            this.mesh.quaternion.copy(this.body.quaternion)
           
            // console.log(this.mesh.position);
        }

    }
}