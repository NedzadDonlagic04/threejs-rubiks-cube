// Importing all the needed modules for this code to work
import * as THREE from 'three';

// Exporting the class Cube which is used to represent a cube made by grouping a BoxGeometry and EdgesGeometry
// It's constructor takes as parameters the location it will be placed on
// The way this works is that inside this class there is a property cube which will be an object type Group
// Inside it there will be a cube (a box with the same dimensions) and edges around said cube
// This will make it look cleaner, to me at least
export class Cube{
    constructor(x, y, z)
    {
        // Geometry and material used for making the cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: '#36454F'});  // grey
        
        const materials = new Array(6);
        materials.fill(material, 0, 6);
        
        // [front, back, top, bottom, left, right]
        // ^ Which side goes on what index in the material property

        // Creating our box
        const box = new THREE.Mesh(geometry, materials);
        
        // Creating the box that will represent our edges
        // The dimensions are bigger so they stick out easier
        const edgeGeometry = new THREE.BoxGeometry(1.01, 1.01, 1.01);

        // Creating the edges of the cube
        const edges = new THREE.EdgesGeometry(edgeGeometry);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: '#000000', linewidth: 5 });
        const lines = new THREE.LineSegments(edges, edgeMaterial);

        // Combining the box and the edges to get the cube
        this.cube = new THREE.Group();
        this.cube.add(box);
        this.cube.add(lines);

        // Setting the position of the cube to the parameters from the constructor
        this.cube.position.set(x, y, z);
    }
}