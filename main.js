import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GUI} from 'dat.gui';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(85, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
});
renderer.setSize(window.innerWidth,window.innerHeight);

const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

const material1 = new THREE.MeshBasicMaterial({
    color: 0xFF3131
});

const material2 = new THREE.MeshBasicMaterial({
    color: 0x7CFC00
});

const material3 = new THREE.MeshBasicMaterial({
    color: 0x1F51FF
});

const material4 = new THREE.MeshBasicMaterial({
    color: 0xFFEA00
});

const material5 = new THREE.MeshBasicMaterial({
    color: 0xFF5733
});

const material6 = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF
});

const cubes = [];

for(let z=-0.55;z<=0.55;z+=0.55)
{
    for(let y=-0.55;y<=0.55;y+=0.55)
    {
        for(let x=-0.55;x<=0.55;x+=0.55)
        {
            const cube = new THREE.Mesh(geometry, [material1, material2, material3, material4, material5,material6]);
            
            cube.position.set(x, y, z);
            
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

camera.position.set(0, 4, 0);

const gui = new GUI();
gui.domElement.id = 'gui';

const sides = {
    top: () => {
        camera.position.set(0, 4, 0)
    },
    bottom: () => {
        camera.position.set(0, -4, 0)
    },
    front: () => {
        camera.position.set(4, 0, 0)
    },
    back: () => {
        camera.position.set(-4, 0, 0)
    },
    left: () => {
        camera.position.set(0, 0, 4)
    },
    right: () => {
        camera.position.set(0, 0, -4)
    }
};

gui.add(sides, 'top').name('Top Side');
gui.add(sides, 'bottom').name('Bottom Side');
gui.add(sides, 'front').name('Front Side');
gui.add(sides, 'back').name('Back Side');
gui.add(sides, 'left').name('Left Side');
gui.add(sides, 'right').name('Right Side');

const animation = () => {
    requestAnimationFrame(animation);
    controls.update();
    renderer.render(scene, camera);
}

animation();