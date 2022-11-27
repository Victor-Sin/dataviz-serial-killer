import { Mesh, PlaneGeometry, sRGBEncoding, RepeatWrapping, MeshStandardMaterial,MeshBasicMaterial  } from 'three'
import Experience from '../Experience.js'
import * as CANNON from 'cannon-es';
import BodyTypes from "../Utils/BodyTypes";

export default class Floor {
    static blockFloor;
    shape;
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.world = this.experience.physic.world;


        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
        this.setBlockFloor()
    }

    setWalls() {
        //INIT
        const options = {
            mass: 0,
            collisionFilterGroup: BodyTypes.OTHERS,
        };
        const horizontalWall = new CANNON.Box(new CANNON.Vec3(10, 10, 0.1));
        const verticalWall = new CANNON.Box(new CANNON.Vec3(0.1, 10, 10));

        const wallLeft = new CANNON.Body(options);
        wallLeft.addShape(verticalWall);
        wallLeft.position.set(-10, 0, 0);
        this.world.addBody(wallLeft);

        const wallRight = new CANNON.Body(options);
        wallRight.addShape(verticalWall);
        wallRight.position.set(10, 0, 0);
        this.world.addBody(wallRight);

        const wallFront = new CANNON.Body(options);
        wallFront.addShape(horizontalWall);
        wallFront.position.set(0, 0, 10);
        this.world.addBody(wallFront);

        const wallBack = new CANNON.Body(options);
        wallBack.addShape(horizontalWall);
        wallBack.position.set(0, 0, -10);
        this.world.addBody(wallBack);
    }

    setGeometry() {
        this.geometry = new PlaneGeometry(20, 20)
    }

    setTextures() {
        this.textures = {}

        this.textures.color = this.resources.items.grassColorTexture
        this.textures.color.encoding = sRGBEncoding
        this.textures.color.repeat.set(1.5, 1.5)
        this.textures.color.wrapS = RepeatWrapping
        this.textures.color.wrapT = RepeatWrapping

        this.textures.normal = this.resources.items.grassNormalTexture
        this.textures.normal.repeat.set(1.5, 1.5)
        this.textures.normal.wrapS = RepeatWrapping
        this.textures.normal.wrapT = RepeatWrapping
    }

    setMaterial() {
        this.material = new MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal
        })
    }

    setMesh() {
        this.mesh = new Mesh(this.geometry, this.material)
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

        this.setWalls()
    }

    setBlockFloor() {
        const floorGeometry = this.geometry;
        const floorWith = floorGeometry.parameters.width;
        const floorHeight = floorGeometry.parameters.height;
        Floor.blockFloor = new Mesh(
            new PlaneGeometry(floorWith * 0.875, floorHeight * 0.875),
            new MeshBasicMaterial({ color: 0x000000, transparent: true })
        )
     
       
        this.scene.add(Floor.blockFloor)


    }
}