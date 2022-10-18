import * as CANNON from "cannon-es";
import * as THREE from "three";

/**
 * Récupère l'object courrant, l'ajoute dans le monde physique l'équivalent de l'objet courrant et lie la position des objets
 *
 * @param self
 * @param mass
 */
export default function getPhysicBody(self, mass = 0,geometryName = '') {
    self.shape = createShape(self.mesh.geometry,geometryName)
    self.body =  new CANNON.Body({
        mass:mass,
        position: self.mesh.position.clone(),
        shape : self.shape,
        material: new CANNON.Material('default')
    })
    self.body.quaternion.copy(self.mesh.quaternion)

    self.world.addBody(self.body);
    self.experience.physic.addObjectToUpdate({mesh : self.mesh, body : self.body})
}

/**
 * Adapte la forme de la shape à la geometry du mesh.
 * Si la geometry est plus complexe et qu'on souhaite une forme simple comme box physique on peut imposer une shape
 *
 * @param geometry
 * @returns {module:shapes/Shape.Shape}
 */
function createShape(geometry,geometryName = ''){
    if(geometry instanceof THREE.BoxGeometry || geometryName === "Box"){
        const {width : x, height: y , depth : z} = geometry.parameters;
        return  new CANNON.Box(new CANNON.Vec3(x/2,y/2,z/2));
    }
    else if(geometry instanceof THREE.SphereGeometry || geometryName === "Sphere"){
        const {radius} = geometry.parameters;
        return  new CANNON.Sphere(radius);
    }
    else if(geometry instanceof THREE.CylinderGeometry || geometryName === "Cylinder"){
        const {radiusTop, radiusBottom, height, radialSegments } = geometry.parameters;
        return new CANNON.Cylinder(radiusTop,radiusBottom,height,radialSegments)
    }
}