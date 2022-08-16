import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(85, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
});
renderer.setSize(window.innerWidth,window.innerHeight);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
    color: 0x808080
})

const cubes = [];

for(let z=0;z<3;z++)
{
    for(let y=0;y<3;y++)
    {
        for(let x=0;x<3;x++)
        {
            const cube = new THREE.Mesh(geometry, material);
            
            cube.position.setX(x * 1.1);
            cube.position.setY(y * 1.1);
            cube.position.setZ(z * 1.1);

            scene.add(cube);

            cubes.push(cube);
        }
    }
}

/* Helper Start */

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/* Helper End */

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 6;

const animation = () => {
    requestAnimationFrame(animation);
    controls.update();
    renderer.render(scene, camera);
}

animation();