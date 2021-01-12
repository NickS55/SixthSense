import * as THREE from 'three';

import { create_grass } from './create_grass';
import { create_plate } from './create_plate';
import { add_baseballs, baseballs_GLTF } from './baseball_loader';
import { Baseball } from './Baseball';
import {create_strikezone} from './create_strikezone';
import { Vector3 } from 'three';

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

create_grass(); 
create_plate(); //set plate at 0,0
create_strikezone();

var light = new THREE.AmbientLight(0xFFFFFF, .95);
scene.add(light);

renderer.render( scene, camera );


//
const fastball = new Baseball(3.42085, 2062, -0.893,  50.00, 6.917, 0.005, -125.074, -7.671, -7.709, 26.704, -2.752 );

fastball.create_tracer();

add_baseballs(fastball.x, fastball.y, fastball.z).catch(error => console.error(error));
//



document.getElementById("RHB_View")!.addEventListener("click", RHB_View)
document.getElementById("LHB_View")!.addEventListener("click", LHB_View)
document.getElementById("Pitcher_View")!.addEventListener("click", Pitcher_View)
document.getElementById("Catcher_View")!.addEventListener("click", Catcher_View)

function RHB_View() {
    camera.position.set( -2 * multiplier, -.3 * multiplier, 6 * multiplier);
    camera.lookAt(new Vector3(0, 60.5 * multiplier, 6 * multiplier));
    camera.rotateZ(-Math.PI/2);
    renderer.render( scene, camera );
  }

function LHB_View() {
    camera.position.set( 2 * multiplier, -.3 * multiplier, 6 * multiplier);
    camera.lookAt(new Vector3(0, 60.5 * multiplier, 6 * multiplier));
    camera.rotateZ(Math.PI/2);
    renderer.render( scene, camera );
}

function Pitcher_View() {
    camera.position.set( 0, 60.5 * multiplier, 6 * multiplier);
    camera.lookAt(new Vector3(0, 0, 3 * multiplier));
    camera.rotateZ(Math.PI);
    renderer.render( scene, camera );
}

function Catcher_View() {
    camera.position.set( 0, -2 * multiplier, 1.5 * multiplier);
    camera.lookAt(new Vector3(0, 60.5 * multiplier, 6 * multiplier));
    camera.rotateZ(Math.PI);
    renderer.render( scene, camera );
}


const animate = function () {
    requestAnimationFrame( animate );

    baseballs_GLTF.rotateOnAxis(fastball.vector3Axis, .1);

    renderer.render( scene, camera );

};

animate();



