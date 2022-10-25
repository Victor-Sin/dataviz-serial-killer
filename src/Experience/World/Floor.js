import * as THREE from 'three'
import Experience from '../Experience.js'
import * as CANNON from 'cannon-es';

export default class Floor
{
    shape;
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
        this.setWalls()
    }

    setWalls(){
        let world = this.experience.physic.world;
        let wallShape = new CANNON.Box(new CANNON.Vec3(0.5, 10, 10));
        let wallBody = new CANNON.Body({ mass: 0
        ,collisionFilterGroup:2 });
        wallBody.addShape(wallShape);
        wallBody.position.set(10, 0, 0);
        world.addBody(wallBody);

        let wallShape2 = new CANNON.Box(new CANNON.Vec3(0.5, 10, 10));
        let wallBody2 = new CANNON.Body({ mass: 0
        ,collisionFilterGroup:2 });
        wallBody2.addShape(wallShape2);
        wallBody2.position.set(-10, 0, 0);
        world.addBody(wallBody2);

        let wallShape3 = new CANNON.Box(new CANNON.Vec3(10, 10, 0.5));
        let wallBody3 = new CANNON.Body({ mass: 0
        ,collisionFilterGroup:2 });
        wallBody3.addShape(wallShape3);
        wallBody3.position.set(0, 0, 10);
        world.addBody(wallBody3);

        let wallShape4 = new CANNON.Box(new CANNON.Vec3(10, 10, 0.5));
        let wallBody4 = new CANNON.Body({ mass: 0 });
        wallBody4.addShape(wallShape4);
        wallBody4.position.set(0, 0, -10);
        world.addBody(wallBody4);
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry(20, 20 )
    }

    setTextures()
    {
        this.textures = {}

        this.textures.color = this.resources.items.grassColorTexture
        this.textures.color.encoding = THREE.sRGBEncoding
        this.textures.color.repeat.set(1.5, 1.5)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping

        this.textures.normal = this.resources.items.grassNormalTexture
        this.textures.normal.repeat.set(1.5, 1.5)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)

        let world = this.experience.physic.world;

        this.shape = new CANNON.Plane();
        this.body = new CANNON.Body();

        this.body.mass = 0;
        this.body.addShape(this.shape);
        world.addBody(this.body);
        this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)

    }
}