import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { create_grass } from './create_grass';
import {create_line} from './create_line';
import { create_plate } from './create_plate';

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

create_grass(); //set plate at 0,0
create_plate();

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

    create_tracer(){
        create_line(this.axisRad, this.rpm, this.x, this.y, this.z, this.velX, this.velY, this.velZ, this.plate_x, this.plate_z)
    }

    set_axis(){
        var axis = new THREE.Vector3(Math.cos(this.axisRad), Math.sin(this.axisRad), 0);
        this.vector3Axis = axis.normalize();
    }
}




////
var baseballs : Baseball[] = [];
const fastball = new Baseball(3.42085, 2062, 0.893,  53.72, 7.397, 0.005, -125.074, -7.671, -1.481, 3.672);
const changeup = new Baseball(3.42085, 2062, 0.893,  53.72, 7.397, 0.005, -125.074, -7.671, -1.481, 3.672);
const slider = new Baseball(3.42085, 2062, 0.893,  53.72, 7.397, 0.005, -125.074, -7.671, -1.481, 3.672);

baseballs.push(fastball);
baseballs.push(changeup);
baseballs.push(slider);







const loader = new GLTFLoader();
var baseballs_GLTF: THREE.Group[] = [];

function loadModel(url: string){
    return new Promise((resolve) => {
        loader.load(url, function(object){resolve(object)});
    });
}

async function add_baseballs() {
    var ball_GLTF: any, ball_mesh: any;

    for(var baseball in baseballs){
        ball_GLTF = await loadModel('styles/baseball/Baseball.glb');
        ball_mesh = ball_GLTF.scene;
        scene.add(ball_mesh);

        baseballs_GLTF.push(ball_mesh);

        ball_mesh.scale.set(.1,.1,.1);
        ball_mesh.position.set(parseInt(baseball) * 100, 0, 0);
    }
}
// add_baseballs().catch(error=>{
//     console.error(error)
// })

add_baseballs();


var light = new THREE.AmbientLight(0xFFFFFF, .95);
scene.add(light);



const animate = function () {
    requestAnimationFrame( animate );

    for( var baseball in baseballs_GLTF){
        baseballs_GLTF[parseInt(baseball)].rotateOnAxis(baseballs[parseInt(baseball)].vector3Axis, .1);
    }

    renderer.render( scene, camera );
};

animate();



