import * as THREE from 'three';

import Experience from "./Experience";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";


export default class Composer{
    #selectedObjects = []

    constructor(target){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.renderer = this.experience.renderer;
        this.target = target;
        this.#setInstance();
    }

    #setInstance(){
        this.instance = new EffectComposer(this.renderer.instance,this.target);

        this.renderPass = new RenderPass(this.scene,this.camera.instance);
        this.instance.addPass(this.renderPass);

        this.outlinePass =new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), this.scene, this.camera.instance );;
        this.instance.addPass(this.outlinePass);
        this.#setParamsOutline()
        this.outlinePass.selectedObjects = this.#selectedObjects;


        this.effectFXAA = new ShaderPass(FXAAShader );
        this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
        this.instance.addPass(this.effectFXAA);

    }

    #setParamsOutline(){
        this.outlinePass.edgeStrength = 10;
        this.outlinePass.edgeGlow  = 0;
        this.outlinePass.edgeThickness  = 1;
        this.outlinePass.pulsePeriod = 0;
        this.outlinePass.edgeStrength = 5;
        this.outlinePass.visibleEdgeColor.set("#6e6e6e")
        this.outlinePass.hiddenEdgeColor.set("#252525")


    }

    addSelectedObject(object){
        if(!this.#selectedObjects.includes(object)){
            this.#selectedObjects.splice(0, 1); // 2nd parameter means remove one item only
                this.#selectedObjects.push(object)
        }
    }

    removeSelectedObject(){
            this.#selectedObjects.splice(0, 1); // 2nd parameter means remove one item only
    }

    selectedObjectsEmpty(){
        return this.#selectedObjects.length == 0;
    }

    update(){
        if(this.instance){
            this.instance.render();
        }
    }

}