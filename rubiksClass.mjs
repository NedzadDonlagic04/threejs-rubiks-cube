// Importing all the needed modules for this code to work
import * as THREE from 'three';

// Creating a class called RubiksCube which we will be exporting to another file
export class RubiksCube{
    // Defining the constructor for the class
    // The parameters for it will be:
    // - the scene to which the cubes will be added to
    // - the size of each individual cube
    // - the position they cubes will be set on the x, y and z axes
    constructor(scene, size, distance)
    {
        // Creating an object that wil represent the cube, a box will the same width, height and depth
        const geometry = new THREE.BoxGeometry(size, size, size);

        // Creating an object that will represent the color of the cube, this will be the default color
        const material = new THREE.MeshBasicMaterial({ color: 0x36454F});   // gray color

        // Creating an empty array property called cubes which will hold all of the cubes that make up the rubik's cube
        this.cubes = [];

        // Nested for loop nested in another for loop
        // This is used to make our 3x3x3 rubik's cube appear like it does in the 3D space
        // The conditions are what they are so that the center of the 3D world is the central cube inside the rubik's cube
        // In here we will also create a 3D array inside the cubes property by using well placed push method calls
        for(let z=-distance, k=0; z<=distance; z+=distance, k++)
        {
            this.cubes.push([]);
            for(let y=-distance, j=0; y<=distance; y+=distance, j++)
            {
                this.cubes[k].push([]);
                for(let x=-distance, i=0; x<=distance; x+=distance, i++)
                {
                    // By creating a mesh object which contains the geometry and materials (6 for 6 different sides of the cube) we create a single cube
                    // [front, back, top, bottom, left, right]
                    const cube = new THREE.Mesh(geometry, [material, material, material, material, material, material]);
                    
                    // Setting the position of the cube
                    cube.position.set(x, y, z);
                    
                    // Adding the cube to the scene
                    scene.add(cube);

                    // Adding the cube to the end of our cubes 3D array
                    this.cubes[k][j].push(cube);
                }
            }
        }
        
        // Making a property called colors which will represent all the colors the cube can use
        // The names of the properties inside the colors object have the starting letter of the colors the represent, i.e. r = red, g = green etc.
        this.colors = {
            r: 0xFF1919,
            g: 0x199B4C,
            b: 0x0D48AC,
            y: 0xFED52F,
            o: 0xFF5525,
            w: 0xFFFFFF
        };
    }

    // Defining the method color which will take as a parameter an object's properties whose names are count and colors, expected to be received from the json
    // After this we create arrow functions that take a given hex codes and give them to proper sides of individual cubes, they are made to work based on the sides of the cube, so there's a color for the front, back, top, bottom, left and right side, but they are defined inside the color method because I want them to be private with how they won't be accessed outside it
    // After we define all these functions we will take the colors property and convert it into an array of hex codes
    // Which will then based on a switch using the count variable call the proper function to color the given side of the rubik's cube
    color({count, colors})
    {
        const colorTop = hexCodes => {
            let index = 0;
            for(let i=0; i<3; i++)
            {
                for(let j=2; j>=0; j--)
                {
                    this.cubes[j][2][i].material[2] = new THREE.MeshBasicMaterial({ color: hexCodes[index]});
                    index++;
                }
            }
        }
    
        const colorFront = hexCodes => {
            let index = 0;
            for(let i=2; i>=0; i--)
            {
                for(let j=2; j>=0; j--)
                {
                    this.cubes[j][i][2].material[0] = new THREE.MeshBasicMaterial({ color: hexCodes[index]});
                    index++;
                }
            }
        }
    
        const colorBack = hexCodes => {
            let index = 0;
            for(let i=2; i>=0; i--)
            {
                for(let j=0; j<3; j++)
                {
                    this.cubes[j][i][0].material[1] = new THREE.MeshBasicMaterial({ color: hexCodes[index]});
                    index++;
                }
            }
        }
    
        const colorRight = hexCodes => {
            let index = 0;
            for(let i=2; i>=0; i--)
            {
                for(let j=2; j>=0; j--)
                {
                    this.cubes[0][i][j].material[5] = new THREE.MeshBasicMaterial({ color: hexCodes[index]});
                    index++;
                }
            }
        }
    
        const colorLeft = hexCodes => {
            let index = 0;
            for(let i=2; i>=0; i--)
            {
                for(let j=0; j<3; j++)
                {
                    this.cubes[2][i][j].material[4] = new THREE.MeshBasicMaterial({ color: hexCodes[index]});
                    index++;
                }
            }
        }
    
        const colorBottom = hexCodes => {
            let index = 0;
            for(let i=2; i>=0; i--)
            {
                for(let j=0; j<3; j++)
                {
                    this.cubes[i][0][j].material[3] = new THREE.MeshBasicMaterial({ color: hexCodes[index]});
                    index++;
                }
            }
        }

        const hexCodes = [];

        for(let i=0; i<9; i++)
        {
            hexCodes.push(this.colors[`${colors[i]}`]);
        }

        switch(count)
        {
            case 0:
                colorTop(hexCodes);
                break;
            case 1:
                colorFront(hexCodes);
                break;
            case 2:
                colorRight(hexCodes);
                break;
            case 3:
                colorBack(hexCodes);
                break;
            case 4:
                colorLeft(hexCodes);
                break;
            case 5:
                colorBottom(hexCodes);
        }
    }
}