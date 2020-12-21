import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls}  from 'three/examples/jsm/controls/OrbitControls.js'
import {create_line} from './create_line'

var 
camera: THREE.Camera,
scene: THREE.Scene,
renderer: THREE.WebGLRenderer;

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene = new THREE.Scene();


const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 150, 350 );
controls.update()

//scene.background = new Color(0x87ceeb);
scene.background = new THREE.Color(0x000000);

var height = 500;
const plane_geometry = new THREE.PlaneGeometry(100, height);
const plane_material = new THREE.MeshBasicMaterial( {color: 0x567d46, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( plane_geometry, plane_material );
scene.add( plane );

var line: THREE.Line;

line = create_line(3.42085, 2062, 0.893, 53.72, 7.396, 0.005, -125.074, -7.671, -1.481, 3.672);

scene.add(line)


var baseball_obj: THREE.Group;
//Instantiate a manager
var manager = new THREE.LoadingManager();

manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

  console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onLoad = function ( ) {
  baseball_obj.position.set (0, (height /2)* (4/5) ,50);
  
  baseball_obj.scale.set(.1,.1,.1)
  animate();
  console.log("entering animate")

};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

  console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onError = function ( url ) {

  console.log( 'There was an error loading ' + url );

};

// Instantiate a loader
var loader = new GLTFLoader(manager);

// Load a glTF resource
loader.load( 'styles/baseball/Baseball.glb', function ( baseball_gltf ) {
    baseball_obj = baseball_gltf.scene
    scene.add( baseball_obj );
} );



var light = new THREE.AmbientLight(0xFFFFFF, .95);
scene.add(light);
//var currtime = Date.now();


function animate() {
  requestAnimationFrame( animate );

  //var time = (Date.now() - currtime) / 1000;

  var axis = new THREE.Vector3(0,1,0).normalize();

  baseball_obj.rotateOnAxis(axis,.1);
  
  controls.update();
  renderer.render( scene, camera );
}

// function create_line(spinAngle: number, rpm: number, x: number , y: number , z: number , velX: number , velY: number, velZ: number, plate_x: number , plate_z: number){
//   //change to thick lines
//   const material = new THREE.LineBasicMaterial( { 
//     color: 0xCAFD7C,
//     linewidth: 5,
//     linecap: 'round',
//    } );

//    var oldy, mass, B, gravity, accY, accX, accZ;

//    velX *= .01
//    velY *= .01
//    velZ *= .01

//   oldy = y;
//   mass = 5/16;
//   B = 4.1 * Math.pow(10, -4);
//   gravity = 9.8;

//   //expirement with how many points makes a good tail drag
//   const points = [];
//   while(Math.abs(oldy - y ) <= 50){
//     points.push( new THREE.Vector3(x, y, z) );


//     // acceleration = .5 * density of air * Velocity^2 * cross sectional area * drag coefficient

//     //using .3 as Drag Coefficient, see https://www.grc.nasa.gov/www/k-12/airplane/balldrag.html
//     //real range between .2 and .5 because of drag crisis
//     accY = (.5 * .0765 * .3 * Math.PI * Math.pow((1.437/12) , 2) * Math.pow(velY, 2)) / mass ;
//     accX = B * (rpm / 60) / 100 * velY * Math.cos(spinAngle);
//     accZ = -B * rpm / 60 / 100 * velY * Math.sin(spinAngle) - gravity;

//     console.log(x);
//     console.log("acc" + accX);
//     console.log("velo:" +  velX);

//     x += velX;
//     y += velY;
//     z += velZ;

//     velX = velX + accX;
//     velY = velY + accY;
//     velZ = velZ;// + accZ;

//   }
//   console.log(points.length)
//   const geometry = new THREE.BufferGeometry().setFromPoints( points );
//   const line = new THREE.Line( geometry, material );
//   scene.add( line );
// }