import * as THREE from 'three'
import Enemy from "./Enemy";

export default class EnemyVertical extends Enemy
{
    constructor(name)
    {
        super(name);

        // Debug
        if(this.debug.active)
        {
            if(Enemy.enemiesFolder)  this.debugFolder  = this.debug.ui.addFolder('EnemyHorizontal');
        }

        const material = new THREE.MeshBasicMaterial();
        this.mesh = new THREE.Mesh(Enemy.geometry, material);
    }

    update()
    {
        super.update();
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}