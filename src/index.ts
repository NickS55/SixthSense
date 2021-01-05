import * as THREE from 'three';
import { OrbitControls}  from 'three/examples/jsm/controls/OrbitControls.js'

import { create_grass } from './create_grass';
import { create_plate } from './create_plate';
import { add_baseballs, baseballs_GLTF } from './baseball_loader';
import { Baseball } from './Baseball';
import {create_strikezone} from './create_strikezone';

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

const controls = new OrbitControls(camera, renderer.domElement );

export var multiplier: number;
multiplier = 10;

create_grass(); //set plate at 0,0
create_plate();
create_strikezone();

export var baseballs : Baseball[] = [];
const fastball = new Baseball(3.42085, 2062, 0.893,  53.72, 7.397, 0.005, -125.074, -7.671, -7.709, 26.704, -2.752 );
const changeup = new Baseball(3.42085, 2062, 0.893,  53.72, 7.397, 0.005, -125.074, -7.671, -7.709, 26.704, -2.752);
const slider = new Baseball(3.42085, 2062, 0.893,  53.72, 7.397, 0.005, -125.074, -7.671, -7.709, 26.704, -2.752);

baseballs.push(fastball);
baseballs.push(changeup);
baseballs.push(slider);

fastball.create_tracer();

add_baseballs().catch(error => console.error(error));


var light = new THREE.AmbientLight(0xFFFFFF, .95);
scene.add(light);



const animate = function () {
    requestAnimationFrame( animate );

    for( var baseball in baseballs_GLTF){
        baseballs_GLTF[parseInt(baseball)].rotateOnAxis(baseballs[parseInt(baseball)].vector3Axis, .1);
    }

    controls.update();
    renderer.render( scene, camera );

};

animate();



