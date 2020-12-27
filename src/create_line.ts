import * as THREE from 'three';
import { multiplier, scene } from './index';

function create_line(spinAngle: number, rpm: number, x: number , y: number , z: number , velX: number , velY: number, velZ: number, plate_x: number , plate_z: number){
    //change to thick lines
    const material = new THREE.LineBasicMaterial( { 
      color: 0xCAFD7C,
      linewidth: 5,
      linecap: 'round',
     } );
  
     var oldy, mass, B, gravity, accY, accX, accZ;
  
     velX *= .01
     velY *= .01
     velZ *= .01
  
    oldy = y;
    mass = 5/16;
    B = 4.1 * Math.pow(10, -4);
    gravity = 9.8;
  
    //expirement with how many points makes a good tail drag
    const points = [];
    while(Math.abs(oldy - y ) <= 53){
      points.push( new THREE.Vector3(x * multiplier, y * multiplier, z * multiplier) );
  
  
      // acceleration = .5 * density of air * Velocity^2 * cross sectional area * drag coefficient
  
      //using .3 as Drag Coefficient, see https://www.grc.nasa.gov/www/k-12/airplane/balldrag.html
      //real range between .2 and .5 because of drag crisis
      accY = (.5 * .0765 * .3 * Math.PI * Math.pow((1.437/12) , 2) * Math.pow(velY, 2)) / mass ;
      accX = B * (rpm / 60) / 100 * velY * Math.cos(spinAngle);
      accZ = -B * rpm / 60 / 100 * velY * Math.sin(spinAngle) - gravity;
  
      console.log(x * multiplier, y* multiplier, z* multiplier);
      console.log("acc" + accX);
      console.log("velo:" +  velX);
  
      x += velX ;
      y += velY ;
      z += velZ ;
  
      velX = velX + accX;
      velY = velY + accY;
      velZ = velZ; //;
  
    }
  console.log(points.length)
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  const line = new THREE.Line( geometry, material );
  scene.add(line);
}

export {create_line};