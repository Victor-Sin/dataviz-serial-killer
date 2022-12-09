import { Body, Material, Box, Sphere, Cylinder, Vec3 } from "cannon-es";
import { BoxGeometry, SphereGeometry, CylinderGeometry } from "three";
import BodyTypes from "./BodyTypes";

/**
 * Récupère l'object courrant, l'ajoute dans le monde physique l'équivalent de l'objet courrant et lie la position des objets
 *
 * @param self CURRENT OBJECT
 * @param propetiesObj MODIFY BODY PROPETIES
 * @param geometryName GEOMETRY NAME (REPLACE)
 * @param materialName
 */
export default function getPhysicBody(self, propetiesObj = { mass: 1 }, geometryName = '', materialName = "default", geometryShape = null) {
    self.setShape(createShape(self.getMesh().geometry, geometryName, geometryShape));
    self.setBody(new Body({
        position: self.getMesh().position.clone(),
        shape: self.getShape(),
        material: new Material(materialName),
        ...propetiesObj,

    }));

    self.getBody().quaternion.copy(self.getMesh().quaternion)

    self.world.addBody(self.getBody());
}

/**
 * Adapte la forme de la shape à la geometry du mesh.
 * Si la geometry est plus complexe et qu'on souhaite une forme simple comme box physique on peut imposer une shape
 *
 * @param geometry
 * @param geometryName
 * @returns {module:shapes/Shape.Shape}
 */
function createShape(geometry, geometryName = '', geometryShape = null) {
    if (geometry instanceof BoxGeometry || geometryName === "Box") {
        if (geometryShape) {
            return new Box(new Vec3(geometryShape.width / 2, geometryShape.height / 2, geometryShape.depth / 2));
        } else {
            const { width: x, height: y, depth: z } = geometry.parameters;
            return new Box(new Vec3(x / 2, y / 2, z / 2));
        }

    }
    else if (geometry instanceof SphereGeometry || geometryName === "Sphere") {
        if (geometryShape) {
            return new Sphere(geometryShape.radius);
        } else {
            const { radius } = geometry.parameters;
            return new Sphere(radius);
        }

    }
    else if (geometry instanceof CylinderGeometry || geometryName === "Cylinder") {
        if (geometryShape) {
            return new Cylinder(geometryShape.radiusTop, geometryShape.radiusBottom, geometryShape.height, geometryShape.radialSegments);
        } else {
            const { radiusTop, radiusBottom, height, radialSegments } = geometry.parameters;
            return new Cylinder(radiusTop, radiusBottom, height, radialSegments)
        }

    }
}