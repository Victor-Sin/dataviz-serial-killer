import Entity from "./Entity";
import {
    Raycaster,
    Vector2,
    Color, MeshStandardMaterial
} from "three";
import keyObjects,{contentObjects} from "../../Utils/KeyObjets";

export default class MouseHandler extends Entity{
    #raycaster;
    #mouse;
    #listObject = []
    #listMesh = []
    #environment
    #intersects

    constructor() {
        super();
        this.#raycaster = new Raycaster();
        this.#mouse = new Vector2();
        this.#raycaster.setFromCamera(this.#mouse, this.camera);
        this.#handleMouseMove();
        this.#handlePoseClick()
        this.#environment = this.globalWorld.environment
    }

    addObject(object){
        this.#listObject.push(object)
        this.#listMesh.push(object.getMesh());
    }

    addMesh(mesh){
        this.#listMesh.push(mesh);
    }

    #handleMouseMove() {
        window.addEventListener('mousemove', (e) => {

            this.#intersects = this.#raycaster.intersectObjects(this.#listMesh);
            this.#mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.#mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.#raycaster.setFromCamera(this.#mouse, this.camera);
        })
    }

    #checkHint(obj){
        if(!this.globalWorld.hintVisited.includes(obj)){
            this.globalWorld.hintVisited.push(obj)
            document.querySelector(".current").innerHTML = this.globalWorld.hintVisited.length
        }
    }

    #checkTv(object){
        if(object.name == "VHS"){
            this.globalWorld.livingRoom.rectAreaLight.intensity = 20;
            this.globalWorld.livingRoom.tv.material = new MeshStandardMaterial({color : "#FFFFFF"});
        }
    }

    #modifyHUD(object){
        document.querySelectorAll(".graph").forEach(elt => {
            if(elt.classList.contains(object.name)){
               elt.classList.remove("hidden");
            }
            else{
                elt.classList.add("hidden");
            }
        })
        const subline = document.querySelector(".leftInfo .subline")
        subline.querySelector("h1").innerHTML = contentObjects[object.name].title + " <span>?</span>";
        subline.querySelector("p").innerHTML = contentObjects[object.name].content;
    }

    #handlePoseClick() {
        window.addEventListener('click', (e) => {
            if (this.#intersects && this.#intersects.length > 0 && this.globalWorld.currentPart == 2 && !this.globalWorld.animInFocus) {
                this.experience.camera.controls.enabled = false;
                if(!keyObjects.includes(this.#intersects[0].object.name)){
                    this.globalWorld.targetCamera = this.#intersects[0].object.parent.position
                    this.globalWorld.currentObj =  this.#intersects[0].object.parent
                    this.#checkHint(this.#intersects[0].object.parent)
                    this.#modifyHUD(this.#intersects[0].object.parent)
                }
                else{
                    this.globalWorld.targetCamera = this.#intersects[0].object.position
                    this.globalWorld.currentObj =  this.#intersects[0].object
                    this.#checkHint(this.#intersects[0].object)
                    this.#checkTv(this.#intersects[0].object)
                    this.#modifyHUD(this.#intersects[0].object)
                }
            }
        })
    }

    update() {
        if (this.#intersects &&  this.#intersects.length > 0) {
          if(this.globalWorld.currentPart == 2 && !this.globalWorld.currentObj){
              if(!keyObjects.includes(this.#intersects[0].object.name)){
                  this.composer.addSelectedObject(this.#intersects[0].object.parent);
              }
              else{
                  this.composer.addSelectedObject(this.#intersects[0].object);
              }
          }
        }
        else if(this.composer.selectedObjectsEmpty()){
            this.composer.removeSelectedObject();
        }
    }


}