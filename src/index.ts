import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import {create_line} from './create_line';

export var 
camera: THREE.Camera,
scene: THREE.Scene,
renderer: THREE.WebGLRenderer;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
scene.background = new THREE.Color(0x87ceeb);
camera.position.set( 0, 150, 400 );



export var multiplier: number;
multiplier = 10;



var plate_mound_distance = 60.5 * multiplier;

const grass_geometry = new THREE.PlaneGeometry(100, plate_mound_distance * 1.2);
const grass_material = new THREE.MeshBasicMaterial( {color: 0x567d46, side: THREE.DoubleSide} );
const grass = new THREE.Mesh( grass_geometry, grass_material );
scene.add( grass );
grass.position.set(0, plate_mound_distance / 2, 0); //set plate at 0,0

scene.background = new THREE.Color(0x87ceeb);

//create a plate

const geometry = new THREE.Geometry();
geometry.vertices.push(
    new THREE.Vector3( -.708 * multiplier, 0, .5),  // 5
    new THREE.Vector3(.708 * multiplier, 0, .5),  // 6
    new THREE.Vector3( -.708 * multiplier, .708 * multiplier, .5),  // 7
    new THREE.Vector3( .708 * multiplier, .708 * multiplier, .5),  // 8
    new THREE.Vector3( 0, 1.416 * multiplier , .5),  // 9
  );

geometry.faces.push(
    // front
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(2, 3, 4),
    new THREE.Face3(2, 1, 3),
  );

const material = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} );
const plate = new THREE.Mesh( geometry, material );
scene.add(plate);

plate.rotateZ(Math.PI);

    //Instantiate a manager
    var manager = new THREE.LoadingManager();

    manager.onStart = function (url, itemsLoaded, itemsTotal) {

        console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

    };

    manager.onLoad = function (){
        baseballs[0].position.set(0 , 100 , 0);
        animate();
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {

        console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

    };

    manager.onError = function (url) {

        console.log('There was an error loading ' + url);

    };











const objects = new THREE.Group();

let baseballs: THREE.Group[] = [];

class Baseball{
    axisRad: number;
    x: number;
    y: number;
    z: number;
    velX: number;
    velY: number;
    velZ: number;
    rpm: number;
    plate_x: number;
    plate_z: number;
    vector3Axis: any;
    constructor(
        axisRad: number, rpm: number,
        x: number, y: number, z: number,
        velX: number, velY: number, velZ: number, plate_x:number, plate_z: number
        ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.axisRad = axisRad;
        this.rpm = rpm;
        this.velX = velX;
        this.velY = velY;
        this.velZ = velZ;
        this.plate_x = plate_x;
        this.plate_z = plate_z;

        var axis = new THREE.Vector3(Math.cos(this.axisRad), 0, Math.sin(this.axisRad));
        this.vector3Axis = axis.normalize();
      }

    create_baseball(): void{
        let subject: THREE.Group;
            // Instantiate a loader
            var loader = new GLTFLoader(manager);
        
            // Load a glTF resource
            loader.load('styles/baseball/Baseball.glb',  (baseball_gltf) => {
                subject = baseball_gltf.scene;
                baseballs.push(subject);
                objects.add(subject);
            });
            
    }

    create_tracer(){
        create_line(this.axisRad, this.rpm, this.x, this.y, this.z, this.velX, this.velY, this.velZ, this.plate_x, this.plate_z)
    }

    set_axis(){
        var axis = new THREE.Vector3(Math.cos(this.axisRad), Math.sin(this.axisRad), 0);
        this.vector3Axis = axis.normalize();
    }
}

const slider = new Baseball(3.42085, 2062, 0.893,  53.72, 7.397, 0.005, -125.074, -7.671, -1.481, 3.672);
slider.create_baseball();
slider.create_tracer();

scene.add(objects);

var light = new THREE.AmbientLight(0xFFFFFF, .95);
scene.add(light);



const animate = function () {
    requestAnimationFrame( animate );

    baseballs[0].rotateOnAxis(slider.vector3Axis, .1);

    renderer.render( scene, camera );
};

animate();