// Importing all the needed modules for this code to work
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GUI} from 'dat.gui';


/* First Step: Creating the 3 objects that will represent the base of our 3D section of the website */

// Creating an object that wil represent the scene of our 3D space
const scene = new THREE.Scene();

// Creating an object that wil represent the camera of our 3D space
// As an argument to the constructor we're passing the fov, aspect ration, the near and far frustum
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// Creating an object that wil represent the renderer of our 3D space
// To it's constructor as an argument we're passing an object that has the property canvas to which we're assigning the canvas element that will hold the 3D space
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
});

// Setting the size of the renderer, it's the same as the aspect ratio of the camera
renderer.setSize(window.innerWidth,window.innerHeight);


/* Second Step: Creating all the cubes we'll need to represent the 3x3x3 rubik's cube */

// Creating an object that wil represent the cube, a box will the same width, height and depth
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

/* In this section we are creating 6 objects that represent the color that we will wrap around the cube */

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

// Creating an empty array which will hold all of the cubes that make up the rubik's cube
const cubes = [];

// Creating a variable which will save the distance between each cube
// Because it will be reused a lot for the sake of an easier time for me I've made it a variable
const distance = 0.52;

// Nested for loop nested in another for loop
// This is used to make our 3x3x3 rubik's cube appear like it does in the 3D space
// The conditions are what they are so that the center of the 3D world is the central cube inside the rubik's cube
for(let z=-distance;z<=distance;z+=distance)
{
    for(let y=-distance;y<=distance;y+=distance)
    {
        for(let x=-distance;x<=distance;x+=distance)
        {
            // By creating a mesh object which contains the geometry and materials (6 for 6 different sides of the cube) we create a single cube
            const cube = new THREE.Mesh(geometry, [material1, material2, material3, material4, material5,material6]);
            
            // Setting the position of the cube
            cube.position.set(x, y, z);
            
            // Adding the cube to the scene
            scene.add(cube);

            // Adding the cube to the end of our cubes array
            cubes.push(cube);
        }
    }
}

/* Helper Section */
// In this section I will keep the temporary helpers which don't affect the functionality of the code just add extra visual help to the 3D canvas

// The AxesHelper object creates an object that represents the x, y and z axes in our 3D canvas
// As the constructor argument it takes the size of the axes
// x axis is red
// y axis is green
// z axis is blue
// ^Leaving this here because I keep forgetting

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/* Helper Section End */


/* Third Step: Creating a way for our camera to move and a gui to allow us to move to a specific side of the cube */

// Creating an OrbitControls object which will represent controls that allow movement of the camera
// As argument to the constructor it takes the camera and the document element of the renderer
const controls = new OrbitControls(camera, renderer.domElement);

// Setting the position of our camera
camera.position.set(0, 4, 0);

// Creating an object that will represent our GUI
// It will position itself automatically to the top right corner
const gui = new GUI();

// Creating an object called sides
// This object contains properties which all have a name that represent a side of the cube
// The values they store are all arrow functions that set the camera position to the same one as the name
// This object will be useful later
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

// Using the previously created gui object we can add buttons that each when pressed will take the user to the respective side of the cube
// By calling the add method we add an action to the gui, the action is based on the initial value we pass, in this case we pass an object which has each property hold an arrow function, because it's a function it will be seen as a button
// The first argument is the object the second is the property name
// Additionally we can call the name method right after to give that button a fitting description, if we don't do this the text will be the property name we passed
gui.add(sides, 'top').name('Top Side');
gui.add(sides, 'bottom').name('Bottom Side');
gui.add(sides, 'front').name('Front Side');
gui.add(sides, 'back').name('Back Side');
gui.add(sides, 'left').name('Left Side');
gui.add(sides, 'right').name('Right Side');

/* Final Step: Creating the function that will do the animation of the 3D canvas and adding all the event listeners */

// Defining an arrow function called animation, which will when called call the requestAnimationFrame function and give itself as a callback, after which it will update the controls and render the scene again
// The requestAnimationFrame function is asynchronous so the code under it will execute before it calls the callback it's passed
const animation = () => {
    requestAnimationFrame(animation);
    controls.update();
    renderer.render(scene, camera);
}

/* Event listeners below this point */

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.render(scene, camera);
});

/* Event listeners listed above */


// Calling our animation function
animation();