// Importing all the needed modules for this code to work
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GUI} from 'dat.gui';
import * as TWEEN from '@tweenjs/tween.js';
import { RubiksCube } from './rubiksClass.mjs';


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


/* Second Step: Creating all the cubes we'll need to represent the 3x3x3 rubik's cube and adding helpers */

// Making an instance of the class RubiksCube that I defined in another file
// To it's constructor we are passing the scene to which it will add the cube, the side of the cube's cubes, and the location they will be placed on the x, y and z axes
const rubiksCube = new RubiksCube(scene, 0.5, 0.52);

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


/* Third Step: Creating a way for our camera to move, a gui to allow us to move to a specific side of the cube and some animation to make it look more smooth */

// Creating an OrbitControls object which will represent controls that allow movement of the camera
// As argument to the constructor it takes the camera and the document element of the renderer
const controls = new OrbitControls(camera, renderer.domElement);

// Setting the position of our camera
camera.position.set(0, 4, 0);

// Making an arrow function that will be used to create our tween
// To quote the documentation
// "A tween (from in-between) is a concept that allows you to change the values of the properties of an object in a smooth way"
// And it is exactly what we are doing here for the passed coordinates to where we want the camera to be at the end of the animation we will take the current position and slightly shift it little by little until it gets to the desired coordinate
const makeTween = (posX, posY, posZ) => {

    const camPos = camera.position;
    
    // Creating our tween which is an instance of the Tween class
    // It's constructor takes the starting coordinates and using the to method we can add the ending coordinates as well as the delay for the animation
    const tween = new TWEEN.Tween({x: camPos.x, y: camPos.y, z: camPos.z}).to({x: posX, y: posY, z: posZ}, 500);
    
    // In order to see these changes we need to update them little by little on the camera, using the onUpdate method we can pass a callback which will be called each time the update function is called
    tween.onUpdate( ({
        x,y,z
    }) => {
        camera.position.set(x, y, z);
    });

    // Using the start method we start the tween
    tween.start();
}

// Creating an object called sides
// This object contains properties which all have a name that represent a side of the cube
// The values they store are all arrow functions that set the camera position to the same one as the name
// Each arrow function will call the previously made makeTween function with just different coordinates
const sides = {
    top: () => {
        makeTween(0, 4, 0);
    },
    bottom: () => {
        makeTween(0, -4, 0);
    },
    front: () => {
        makeTween(4, 0, 0);
    },
    back: () => {
        makeTween(-4, 0, 0);
    },
    left: () => {
        makeTween(0, 0, 4);
    },
    right: () => {
        makeTween(0, 0, -4);
    }
};

// Creating an object that will represent our GUI
// It will position itself automatically to the top right corner
const gui = new GUI();

// Adding 2 folders to our gui
const changePos = gui.addFolder('Change Position');
const toggleOptions = gui.addFolder('Toggle Options');

// Using the previously created changePos object (that represents a folder) we can add buttons that each when pressed will take the user to the respective side of the cube
// By calling the add method we add an action to changePos, the action is based on the initial value we pass, in this case we pass an object which has each property hold an arrow function, because it's a function it will be seen as a button
// The first argument is the object the second is the property name
// Additionally we can call the name method right after to give that button a fitting description, if we don't do this the text will be the property name we passed
changePos.add(sides, 'top').name('Top Side');
changePos.add(sides, 'bottom').name('Bottom Side');
changePos.add(sides, 'front').name('Front Side');
changePos.add(sides, 'back').name('Back Side');
changePos.add(sides, 'left').name('Left Side');
changePos.add(sides, 'right').name('Right Side');

// Using the previously created toggleOptions object (that represents a folder) we can add a checkbox that when ticked will turn on the axes helpers and when ticked off will turn them off
// As previously mentioned the action type is based on the initial value we pass, since this property is a boolean it turns it into a checkbox
toggleOptions.add(axesHelper, 'visible').name('Toggle Axes');

// By default our gui will be closed
gui.close();


/* Forth Step: Using a test api to help us mimic the way it would be received in practice */

// Defining an async arrow function that will have a parameter called index
// It will first use the fetch api to send a request to an api, take the response and check is it ok
// If so it will return the json object, if not it will return a Promise.reject() object which will trigger the catch block
// Lastly we check is the json undefined, if not we will return the given part of the json based on the passed index
const getter = async index => {
    const json = await fetch('https://62e596abde23e2637921e0e5.mockapi.io/colors')
        .then( response => {
            if(response.ok)
            {
                return response.json();
            }
            return Promise.reject();
        })
        .catch( error => console.log(`Error: ${error}`));

    if(json!==undefined)
    {
        return json[index];
    }
}

// Defining an object called fetcher with a get property which will have an async arrow function 
// Inside, it will go through a for in which it will call the previously defined getter function and receive the proper json which it will pass to the color method of the rubiksCube object which will in turn color all the sides of the rubik's cube properly
const fetcher = {
    get: async() => {
        for(let i=0; i<6; i++)
        {
            const json = await getter(i);
            rubiksCube.color(json);
        }
    }
}

// Adding the fetcher object as a button in the gui for easier use
toggleOptions.add(fetcher, 'get').name('Scan');


/* Final Step: Creating the function that will do the animation of the 3D canvas and adding all the event listeners */

// Defining an arrow function called animation, which will when called call the requestAnimationFrame function and give itself as a callback, after which it will update the controls, call the update function and render the scene again
// The requestAnimationFrame function is asynchronous so the code under it will execute before it calls the callback it's passed
const animation = () => {
    requestAnimationFrame(animation);
    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);
}

/* Event listeners below this point */

// Adding an event listener to the window, that will whenever it's resized resize the 3D area we're viewing
window.addEventListener('resize', () => {
    // Changing the camera's aspect ration
    camera.aspect = window.innerWidth/window.innerHeight;
    // Whenever a change is made to the camera after the initial constructor call the updateProjectionMatrix needs to be called to update it
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.render(scene, camera);
});

/* Event listeners listed above */


// Calling our animation function
animation();