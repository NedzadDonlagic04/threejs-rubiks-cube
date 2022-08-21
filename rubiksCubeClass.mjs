// Importing all the needed modules for this code to work
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import {Cube} from '/cubeClass.mjs';

// Defining the class ColorInfo which stores information about on which side of the rubik's cube
// a color can be displayed
class ColorInfo{
    constructor(side, array)
    {
        this.side = side;
        this.indexes = array;
    }
}

// Exporting class RubiksCube which will be used to store the 3x3x3 rubik's cube and show it on the scene
// It's constructor will take as a parameter the scene it will be displayed on
// The constructor will initialize the rubik's cube with basic things, such as setting up properties to be used in methods later on or creating the cubes using the imported Cube class to create the 3x3x3 size of the rubik's cube
export class RubiksCube{
    constructor(scene)
    {
        this.scene = scene;

        this.cubesInit();

        this.colorGuide = [
            new ColorInfo(2, [20, 11, 2, 19, 10, 1, 18, 9, 0]),     // top
            new ColorInfo(0, [18, 9, 0, 21, 12, 3, 24, 15, 6]),     // front
            new ColorInfo(5, [0, 1, 2, 3, 4, 5, 6, 7, 8]),          // right
            new ColorInfo(1, [2, 11, 20, 5, 14, 23, 8, 17, 26]),    // back
            new ColorInfo(4, [20, 19, 18, 23, 22, 21, 26, 25, 24]), // left
            new ColorInfo(3, [24, 15, 6, 25, 16, 7, 26, 17, 8])     // bottom
        ];

        this.colors = {
            r: '#FF1919',
            g: '#199B4C',
            b: '#0D48AC',
            y: '#FED52F',
            o: '#FF5525',
            w: '#FFFFFF'
        };

        this.animationDone = true;
        this.isColored = false;

    }

    // Created the 3x3x3 rubik's cube and adds it to the scene
    cubesInit()
    {
        this.rubiksCube = new THREE.Group();
        this.rubiksCube.name = 'RubiksCube';

        this.cubes = [
            // Front Side
            new Cube(1, 1, -1),
            new Cube(0, 1, -1),
            new Cube(-1, 1, -1),
            new Cube(1, 0, -1),
            new Cube(0, 0, -1),
            new Cube(-1, 0, -1),
            new Cube(1, -1, -1),
            new Cube(0, -1, -1),
            new Cube(-1, -1, -1),

            // Middle Side
            new Cube(1, 1, 0),
            new Cube(0, 1, 0),
            new Cube(-1, 1, 0),
            new Cube(1, 0, 0),
            new Cube(0, 0, 0),
            new Cube(-1, 0, 0),
            new Cube(1, -1, 0),
            new Cube(0, -1, 0),
            new Cube(-1, -1, 0),

            // Back Side
            new Cube(1, 1, 1),
            new Cube(0, 1, 1),
            new Cube(-1, 1, 1),
            new Cube(1, 0, 1),
            new Cube(0, 0, 1),
            new Cube(-1, 0, 1),
            new Cube(1, -1, 1),
            new Cube(0, -1, 1),
            new Cube(-1, -1, 1)
        ];

        this.cubes.forEach( cube => {
            this.rubiksCube.add(cube.cube);
        });

        this.scene.add(this.rubiksCube);

    }

    // When a rotation happens, in order for the next rotation to use the proper cubes we must switch their index spots
    switchFoward(indexes)
    { 
        //   Before  =   After
        // 18 0 6 24 = 24 18 0 6
        // 9 3 15 21 = 21 9 3 15
        [this.cubes[indexes[0]], this.cubes[indexes[2]], this.cubes[indexes[8]], this.cubes[indexes[6]]] =
        [this.cubes[indexes[6]], this.cubes[indexes[0]], this.cubes[indexes[2]], this.cubes[indexes[8]]];

        [this.cubes[indexes[1]], this.cubes[indexes[5]], this.cubes[indexes[7]], this.cubes[indexes[3]]] =
        [this.cubes[indexes[3]], this.cubes[indexes[1]], this.cubes[indexes[5]], this.cubes[indexes[7]]];
    }

    // When a rotation happens, in order for the next rotation to use the proper cubes we must switch their index spots
    switchBackWard(indexes)
    { 
        //   Before  =   After
        // 18 0 6 24 = 24 18 0 6
        // 9 3 15 21 = 21 9 3 15
        [this.cubes[indexes[0]], this.cubes[indexes[2]], this.cubes[indexes[8]], this.cubes[indexes[6]]] =
        [this.cubes[indexes[2]], this.cubes[indexes[8]], this.cubes[indexes[6]], this.cubes[indexes[0]]];

        [this.cubes[indexes[1]], this.cubes[indexes[5]], this.cubes[indexes[7]], this.cubes[indexes[3]]] =
        [this.cubes[indexes[5]], this.cubes[indexes[7]], this.cubes[indexes[3]], this.cubes[indexes[1]]];
    }

    // When this method is called it will color the cube based on the passed color string and index which shows what side of the cube is being colored, after this it also allows for animations to happen
    colorCube(colors, index)
    {
        this.isColored = true;

        if(index===0)
        {
            this.scene.remove(this.rubiksCube);
            this.cubesInit();
        }

        const { side, indexes } = this.colorGuide[index];

        for(const index of indexes)
        {
            const hex = this.colors[colors[0]];
            colors = colors.substring(1);

            this.cubes[index].cube.children[0].material[side] = new THREE.MeshBasicMaterial({ color: hex });
        }
    }

    // Method that will return based on the move given by the API that has the solution to the cube, calls the proper cube rotating method
    getMove(move)
    {
        switch(move)
        {
            case 'U':
                this.rotateTop();
                break;
            case "U'":
                this.rotateTop(true);
                break;
            case 'U2':
                this.rotateTop();
                this.rotateTop();
                break;
            case 'F':
                this.rotateFront();
                break;
            case "F'":
                this.rotateFront(true);
                break;
            case 'F2':
                this.rotateFront();
                this.rotateFront();
                break;
            case 'R':
                this.rotateRight();
                break;
            case "R'":
                this.rotateRight(true);
                break;
            case 'R2':
                this.rotateRight();
                this.rotateRight();
                break;
            case 'B':
                this.rotateBack();
                break;
            case "B'":
                this.rotateBack(true);
                break;
            case 'B2':
                this.rotateBack();
                this.rotateBack();
                break;
            case 'L':
                this.rotateLeft();
                break;
            case "L'":
                this.rotateLeft(true);
                break;
            case 'L2':
                this.rotateLeft();
                this.rotateLeft();
                break;
            case 'D':
                this.rotateBottom();
                break;
            case "D'":
                this.rotateBottom(true);
                break;
            case 'D2':
                this.rotateBottom();
                this.rotateBottom();
                break;
        }
    }

    // Method which when called will based on the solution given rotate the cube, which if used correctly will result in it being solved
    solveCube(solution)
    {
        this.animationDone = false;

        solution = solution.split(' ');

        this.timer = setInterval( () => {
            this.getMove(solution[0]);
            solution.shift();
            if(solution.length===0)
            {
                this.animationDone = true;
                this.isColored = false;
                clearInterval(this.timer);
            }
        },1000);  
    }

    // Method responsible for the animation and partial rotation of the sides of the cube
    // It uses the passed axis to set it as the one around which the passed cubes will rotate for the given angle
    rotation(cube, axis, angle)
    {
        const start = { rotation: 0 };
        const prev = { rotation: 0 };
        const end = { rotation: angle };

        const tween = new TWEEN.Tween(start).to(end, 500).onUpdate(({ rotation }) => {
            cube.position.applyAxisAngle(axis, rotation - prev.rotation);
            cube.rotateOnWorldAxis(axis, rotation - prev.rotation);
    
            prev.rotation = rotation;
        });
    
        tween.start();
    }

    // Method used to rotate the front part of the cube
    // Optional parameter when given true turns it in the opposite direction
    rotateFront(reverse=false)
    {
        const { indexes } = this.colorGuide[1];
        const axis = new THREE.Vector3(1, 0, 0);
        let angle = - Math.PI / 2;

        if(reverse)
        {
            angle = - angle;
        }

        for(const index of indexes)
        {
            this.rotation(this.cubes[index].cube, axis, angle);
        }

        if(reverse)
        {
            this.switchBackWard(indexes);
        }
        else
        {
            this.switchFoward(indexes);
        }
    }

    // Method used to rotate the top part of the cube
    // Optional parameter when given true turns it in the opposite direction
    rotateTop(reverse=false)
    {
        const { indexes } = this.colorGuide[0];
        const axis = new THREE.Vector3(0, 1, 0);
        let angle = - Math.PI / 2;

        if(reverse)
        {
            angle = - angle;
        }

        for(const index of indexes)
        {
            this.rotation(this.cubes[index].cube, axis, angle);
        }

        if(reverse)
        {
            this.switchBackWard(indexes);
        }
        else
        {
            this.switchFoward(indexes);
        }
    }

    // Method used to rotate the right part of the cube
    // Optional parameter when given true turns it in the opposite direction
    rotateRight(reverse=false)
    {
        const { indexes } = this.colorGuide[2];
        const axis = new THREE.Vector3(0, 0, -1);
        let angle = - Math.PI / 2;

        if(reverse)
        {
            angle = - angle;
        }

        for(const index of indexes)
        {
            this.rotation(this.cubes[index].cube, axis, angle);
        }

        if(reverse)
        {
            this.switchBackWard(indexes);
        }
        else
        {
            this.switchFoward(indexes);
        }
    }

    // Method used to rotate the back part of the cube
    // Optional parameter when given true turns it in the opposite direction
    rotateBack(reverse=false)
    {
        const { indexes } = this.colorGuide[3];
        const axis = new THREE.Vector3(-1, 0, 0);
        let angle = - Math.PI / 2;

        if(reverse)
        {
            angle = - angle;
        }

        for(const index of indexes)
        {
            this.rotation(this.cubes[index].cube, axis, angle);
        }

        if(reverse)
        {
            this.switchBackWard(indexes);
        }
        else
        {
            this.switchFoward(indexes);
        }
    }

    // Method used to rotate the left part of the cube
    // Optional parameter when given true turns it in the opposite direction
    rotateLeft(reverse=false)
    {
        const { indexes } = this.colorGuide[4];
        const axis = new THREE.Vector3(0, 0, 1);
        let angle = - Math.PI / 2;

        if(reverse)
        {
            angle = - angle;
        }

        for(const index of indexes)
        {
            this.rotation(this.cubes[index].cube, axis, angle);
        }

        if(reverse)
        {
            this.switchBackWard(indexes);
        }
        else
        {
            this.switchFoward(indexes);
        }
    }

    // Method used to rotate the bottom part of the cube
    // Optional parameter when given true turns it in the opposite direction
    rotateBottom(reverse=false)
    {
        const { indexes } = this.colorGuide[5];
        const axis = new THREE.Vector3(0, -1, 0);
        let angle = - Math.PI / 2;

        if(reverse)
        {
            angle = - angle;
        }

        for(const index of indexes)
        {
            this.rotation(this.cubes[index].cube, axis, angle);
        }

        if(reverse)
        {
            this.switchBackWard(indexes);
        }
        else
        {
            this.switchFoward(indexes);
        }
    }
}