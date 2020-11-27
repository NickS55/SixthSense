import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
//import OrbitControls from 'three/examples/jsm/controls/OrbitControls.js'
import { Color } from 'three';

var camera, scene, renderer;

init();
animate();

function init() {

camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 150, 350 );

scene = new THREE.Scene();

// Instantiate a loader
var loader = new GLTFLoader();

// Load a glTF resource
loader.load( 'styles/baseball/Baseball.gltf', function ( gltf ) {
    scene.add( gltf.scene );
} );

scene.background = new Color('blue')

var light = new THREE.AmbientLight(0x404040);
scene.add(light);

const light2 = new THREE.PointLight( 0xff0000, 1, 100 );
light2.position.set( 50, 50, 50 );
scene.add( light2 );



renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
document.body.addEventListener( 'keydown', onKeyDown, false );

}

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );

}

function onKeyDown(){
  console.log("press")
  switch( event.keyCode ) {
     case 83: // up
     camera.position.z += 5;
     break;
     case 87: // down
     camera.position.z -= 5;
     break;
     case 40: // down
     camera.position.y -= 5;
     break;
     case 38: // down
     camera.position.y += 5;
     break;
  }
}