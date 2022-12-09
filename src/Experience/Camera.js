import {PerspectiveCamera, Vector3} from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    initPosition = new Vector3(-8, 23, 43);
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setControls()
    }

    setInstance()
    {
        this.instance = new PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 150)
        this.instance.position.set(-8, 23, 43)
        // this.instance.target.position.y = 15
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.enabled = true
        this.controls.enablePan = false;
        this.controls.minDistance = 1
        this.controls.maxDistance = 70
        this.controls.maxPolarAngle = Math.PI/2 -Math.PI/10

    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}