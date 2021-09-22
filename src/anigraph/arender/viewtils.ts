import * as THREE from "three";

export function testTriangle(scale:number=25){
    const triangle = new THREE.Shape();
    triangle.moveTo(-scale, -scale);
    triangle.lineTo(scale, -scale);
    triangle.lineTo(-scale, scale);
    const triangleGeometry = new THREE.ShapeGeometry(triangle);

    const triangleMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aa00,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
    return triangleMesh;
}
