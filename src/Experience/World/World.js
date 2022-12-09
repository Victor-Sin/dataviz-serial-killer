import Experience from '../Experience.js'
import Environment from './Environment.js'

import { Vector3} from "three";
import MouseHandler from "./Entity/MouseHandler";
import LivingRoom from "./Entity/LivingRoom";
import {gsap} from "gsap";
import {finalInformations} from "../Utils/KeyObjets";


export default class World
{
    currentPart = 1;
    targetCamera = null
    initialPosition = new Vector3(0,15,0)
    currentObj = null;
    allowOrbit = true
    player;
    animInFocus = null
    hintVisited = []
    startInit = false;

    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
          this.environment = new Environment()
          this.mouseHandler = new MouseHandler();
          this.livingRoom = new LivingRoom();
        })
        this.experience.camera.controls.enabled = false;
        this.initCloseEvent()
    }

    startEvent(){
        document.querySelector('.start').addEventListener("click", (e) => {
            this.currentPart = 2;
            this.experience.camera.controls.enabled = true;
            gsap.to(document.querySelector(".home"),{
                opacity:0,
                duration:0.25
            }).then(() => {
                document.querySelector(".home").classList.add("hidden")
            })
            let anim = gsap.timeline()

            // this.animFocus()
            anim.from(this.livingRoom.pointLight,{
                intensity: 0
            })
            anim.to(this.livingRoom.pointLight,{
                intensity: 50,
                duration: 5,
                ease: "power2.easeOut"
            })



        })
    }



    animFocus(){
        this.animInFocus = gsap.timeline()
        document.querySelector(".focusElts").classList.toggle("hidden")
        const lineLeft = document.querySelector('.leftInfo .line')
        const graphics = document.querySelector('.graphics')

        this.animInFocus.to(document.querySelector(".point"),{
            opacity: 1,
            duration: 0.15
        })
        this.animInFocus.to(lineLeft,{
            width:"15%",
            duration: 0.15
        },'<')
        this.animInFocus.to(graphics,{
            left:"112.5%",
            duration: 0.15
        },"<")
        this.animInFocus.to(lineLeft.querySelector(".subline"),{
            width:"300%",
            duration:0.15,
            ease: "power2.easeOut"
        })
        this.animInFocus.to(lineLeft.querySelector(".subline p"),{
            opacity:1,
            duration: 0.15,
            ease: "power2.easeOut"
        })
        this.animInFocus.to(lineLeft.querySelector(".subline h1"),{
            opacity:1,
            duration: 0.15,
            ease: "power2.easeOut"
        },'<')
        this.animInFocus.to(document.querySelector('.close'),{
            opacity:1,
            duration: 0.15
        })
    }

    animEnd(){
        const animEnd = gsap.timeline()

        animEnd.to(document.querySelector('.final'),{
            backgroundColor: "rgba(0,0,0,0.75)",
            duration: 0.75
        })
        animEnd.to(document.querySelector('.final img:nth-child(1)'),{
            left: "60%",
            top: "50%"
        },'<')
        animEnd.to(document.querySelector('.final img:nth-child(2)'),{
            left: "40%",
            top: "50%"
        },"<")

    }

    initCloseEvent(){
        document.querySelector('.close').addEventListener("click",elt => {
            document.querySelector("#cards").checked = false
            this.animInFocus.reverse()
            setTimeout(() => {
                this.targetCamera = new Vector3(0,15,0)
                this.currentObj =  null
                this.experience.camera.controls.enabled = true;

                if(this.hintVisited.length != 8){
                    document.querySelector(".focusElts").classList.toggle("hidden")
                    this.animInFocus = null;
                }
                else{
                    this.currentPart = 3;
                    document.querySelector(".final").classList.toggle("hidden")
                    const images = document.querySelectorAll(".final img");
                    this.animEnd()
                    images.forEach((elt,i) => {
                        elt.addEventListener("click",(event) => {
                            images.forEach(e => {
                                e.classList.add("finished")
                                e.style.pointerEvents = "none"
                            })
                            document.querySelector(".title .name").innerHTML = finalInformations[i].title.name;
                            document.querySelector(".title .subtitle").innerHTML = finalInformations[i].title.subtitle;
                            document.querySelector(".primeInfo").innerHTML = finalInformations[i].primeInfo;
                            document.querySelector(".subInfo").innerHTML = finalInformations[i].subInfo;

                            if(i == 0){
                                images[1].classList.add("loose")
                            }
                        })
                    })
                }
            },1250)

        })
    }

    targetCameraEvent(){
        if(this.initialPosition.distanceTo(this.targetCamera) > 0.1){
            this.initialPosition.lerp(this.targetCamera,0.05)
            if( this.currentObj){
                this.allowOrbit = false;
                if(this.camera.position.distanceTo(this.targetCamera) > (this.currentObj.name == "Canapé" ? 20 : 7.5))
                    this.camera.position.lerp(this.targetCamera,0.01);
            }
            else if(this.camera.position.distanceTo(this.experience.camera.initPosition) > 5 && !this.allowOrbit){
                this.camera.position.lerp(this.experience.camera.initPosition,0.01);
            }
            else if(this.camera.position.distanceTo(this.experience.camera.initPosition) < 7){
                this.allowOrbit = true;
            }
        }
        else if(this.initialPosition.distanceTo(this.targetCamera) <=  0.1 && this.currentObj ){
            if(!this.animInFocus)
                this.animFocus();
        }

    }

    update()
    {
        if(!document.hidden) {

            if (this.player)
                this.player.update()
            if (this.mouseHandler){
                if(this.targetCamera){
                    this.targetCameraEvent()
                }
                this.mouseHandler.update()
                this.camera.lookAt(this.initialPosition);
            }
            if(this.livingRoom)
                this.livingRoom.update()
            if(!this.startInit && this.livingRoom && this.livingRoom.getMesh()){
                this.startEvent()
                this.startInit = true;
                document.querySelector('.start').innerHTML = "Démarrer";
                document.querySelector('.start').style.pointerEvents = "auto";
            }
        }
    }
}