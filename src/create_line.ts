import * as THREE from 'three';
import { multiplier, scene } from './index';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineBasicMaterial } from 'three';

/*
* A simultion of a pitch based on the data given from trakman 
* Assumtions: 
* - The magnus force is constant (this is not true, but is an assumtion that I am assuming as of right now.)
* - the ball is thrown at Tropicana Field
* - assuming drag coeffient is constant (.3)
*
*
*/
// function create_line(spinAngle: number, rpm: number, x: number , y: number , z: number , velX: number , velY: number, velZ: number, plate_x: number , plate_z: number) {
  function create_line() {

    const matLine = new LineMaterial( {
      color: 0xffffff,
      linewidth: 5, // in pixels
      vertexColors: true,
      //resolution:  // to be set by renderer, eventually
      dashed: false

    } );


    //change to thick lines
    const material = new LineBasicMaterial ( { 
      color: 0xCAFD7C,
      linewidth: 5, //this does not work
      linecap: 'round',
     } );

     const points = [];

     
     //var positions = new Float32Array( 400 * 3 );
     

     //calculate total magnus force of a specific pitch
     
     var accDragY: number, accDragX: number, accDragZ: number;
     var KConst: number
     var airDensity: number, radius: number, circumference: number;
     var dragCoefficient:number, mass:number;
     var totalV: number;
     var gravity: number;

     //
        var x = -1;
        var y = 55;
        var z = 6;

        var accX = 11.181;
        var accY = 33.569;
        var accZ = -12.172;

        var velX = 2.43;
        var velY = -139.26;
        var velZ = -4.86;
     //

     var deltaTime: number;
     deltaTime = 10



      radius = 1.43/12; //feet
      dragCoefficient = .3; 
      //using .3 as Drag Coefficient, see https://www.grc.nasa.gov/www/k-12/airplane/balldrag.html
      //real range between .2 and .5 because of drag crisis

      mass = 5/16; //5oz or 5/16 of a pound
      airDensity = .0740; // pounds per feet^3 this is of at Tropicana Field at 70 F 50% Humidity (later add ability to change weather, evevation, etc..., but for now keep at this)
      KConst = .5 * airDensity * Math.PI * Math.pow(radius, 2) / mass;
      gravity = -32.174;

      totalV = Math.sqrt(Math.pow(velX, 2) + Math.pow(velY, 2) + Math.pow(velZ, 2));

      accDragY = -1 * KConst * dragCoefficient * totalV * (velY);
      accDragX = -1 * KConst * dragCoefficient * totalV * (velX);
      accDragZ = -1 * KConst * dragCoefficient * totalV * (velZ);

      var accMagnusX = accX - accDragX ;
      var accMagnusY = accY - accDragY ;
      var accMagnusZ = accZ - accDragZ - gravity;

      var accMagnusXhelper = accMagnusX / Math.pow(totalV, 2);
      var accMagnusYhelper = accMagnusY / Math.pow(totalV, 2);
      var accMagnusZhelper = accMagnusZ / Math.pow(totalV, 2);

      //var index = 0;
     while(y > 0) {
        
        points.push( new THREE.Vector3(x * multiplier, y * multiplier, z * multiplier) );
        // positions[index++] = x * multiplier;
        // positions[index++] = y * multiplier;
        // positions[index++] = z * multiplier;

        totalV = Math.sqrt(Math.pow(velX, 2) + Math.pow(velY, 2) + Math.pow(velZ, 2));
        
        accDragY = -1 * KConst * dragCoefficient * totalV * (velY);
        accDragX = -1 * KConst * dragCoefficient * totalV * (velX);
        accDragZ = -1 * KConst * dragCoefficient * totalV * (velZ);

        accMagnusX = accMagnusXhelper * Math.pow(totalV, 2);
        accMagnusY = accMagnusYhelper * Math.pow(totalV, 2);
        accMagnusZ = accMagnusZhelper * Math.pow(totalV, 2);
        

        accX = accDragX + accMagnusX;
        accY = accDragY + accMagnusY;
        accZ = accDragZ + accMagnusZ + gravity;

        velX += accX / deltaTime;
        velY += accY / deltaTime;
        velZ += accZ / deltaTime;

        x += velX / deltaTime ;
        y += velY / deltaTime ;
        z += velZ / deltaTime ;

        totalV = Math.sqrt(Math.pow(velX, 2) + Math.pow(velY, 2) + Math.pow(velZ, 2));
        
        accMagnusXhelper = accMagnusX / Math.pow(totalV, 2);
        accMagnusYhelper = accMagnusY / Math.pow(totalV, 2);
        accMagnusZhelper = accMagnusZ / Math.pow(totalV, 2);

        console.log( "coordinates: " + x + ',' + y + ',' + z);
        console.log( "velocities: " + velX + ',' + velY + ',' + velZ);
        console.log( "accelerations: " + accX + ',' + accY + ',' + accZ);
        console.log( "accelMag: " + accMagnusX + ',' + accMagnusY + ',' + accMagnusZ);
        console.log(totalV);
    }

    //const geometry = new LineGeometry();
    //geometry.setPositions(positions);
    //geometry.setFromPoints( points );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    //const geometry = new THREE.LineGeometry();
    //const line = new Line2( geometry, matLine );
    const line = new THREE.Line( geometry, material );
    scene.add(line);
    }




















//      var release_extension: number;
    
//      release_extension = 3.99
//      var xROt, yROT, zROT;
//      var phi;
//      var totalV:number;
//      var S1;

//      S1 = - .166 * Math.log(.336/ (.336-liftCoefficient));

//      var transverseSpin = 78.92 * S1 * totalV;

//      var spinEfficiency = transverseSpin/rpm;

//      var totalAcc = Math.sqrt(Math.pow(accX,2)+ Math.pow(accY,2)+ Math.pow(accZ,2))

//      var TSpinX = transverseSpin * (velY * accMagnusZ - velZ * accMagnusY)/(totalAcc * totalV);
//      var TSpinY = transverseSpin * (velZ * accMagnusX - velX * accMagnusZ)/(totalAcc * totalV);
//      var TspinZ = transverseSpin * (velX * accMagnusY - velY * accMagnusX)/(totalAcc * totalV);

//      var theta = Math.acos(spinEfficiency) * 180/ Math.PI;


//      if (accMagnusZ > 0){
//        phi = Math.atan(accMagnusX/accMagnusZ) * 180 / Math.PI;
//      }else{
//        phi = 360 + Math.atan(accMagnusX/accMagnusZ) * 180 / Math.PI + 90;
//      }









//      var releaseY: number, releaseX: number, releaseZ: number;

     

//      var velReleaseY: number, velReleaseX: number, velReleaseZ: number;
//      var backspin: number, sidespin: number, gyrospin: number;
     
//      var deltaTime: number;
     
//      circumference = Math.PI * Math.pow(radius, 2);

//      releaseY = 60.5 - release_extension;
     
     
//      KConst = .5 * airDensity * Math.PI * Math.pow(radius, 2) / mass
     
     
//      var accMagnusY:number, accMagnusX:number, accMagnusZ:number;
//      var liftCoefficient: number, S: number;
//      var radius: number, circumference: number;
//      var Omega:number, rOmega: number;

//      var wz: number, wx: number, wy: number;

//      var accY, accX, accZ;



//      backspin = Math.cos(spinAngle) * transverseSpin;
//      sidespin = Math.sin(spinAngle) * transverseSpin;


     

//      wx = (backspin * Math.cos(phi * Math.PI/180)-sidespin * Math.sin(theta * Math.PI / 180) * Math.sin(phi*Math.PI / 180) + (gyrospin * velX/ totalV) * Math.PI/ 30); 
//      wy = (backspin * Math.sin(phi * Math.PI/180)- sidespin * Math.sin(theta * Math.PI/180) * Math.cos(phi * Math.PI/180) + (gyrospin * velY/totalV) * Math.PI / 30); 
//      wz = (sidespin * Math.cos(theta * Math.PI/180) + gyrospin * velZ/totalV) * Math.PI / 30;

//      totalV = Math.sqrt(Math.pow(velReleaseX, 2) + Math.pow(velReleaseY, 2) + Math.pow(velReleaseZ, 2));

//      Omega = rpm * 0.10472; //radians per second

//      rOmega = (circumference/2/Math.PI) * Omega/12
//      S = (rOmega/ totalV)


//      liftCoefficient = 1/(2.32+.4/S)

//      accDragY = -1 * KConst * dragCoefficient * totalV * (velY);
//      accMagnusY = KConst * (liftCoefficient / Omega) * totalV * (wz * (velX ) - wx* (velZ));
//      accY = accMagnusY + accDragY;

//      accDragX = -1 * KConst * dragCoefficient * totalV * (velX);
//      accMagnusX = KConst * (liftCoefficient / Omega) * totalV * (wy * velZ - wz * (velX))
//      accX = accMagnusX + accDragX;

//      accDragZ = -1 * KConst * dragCoefficient * totalV * (velZ);
//      accMagnusZ = KConst * (liftCoefficient / Omega) * totalV * (wx * velZ - wy * (velX))
//      gravity = -32.174;

//      accZ = accDragZ + accMagnusZ + gravity





     



















//      var oldy, B, gravity, accY, accX, accZ, liftX;



  
//      velX *= .01;
//      velY *= .01;
//      velZ *= .01;
  
//     oldy = y;
//     mass = 5/16;
//     B = 4.1 * Math.pow(10, -4);
//     gravity = 32.2; //feet per second
  
//     //expirement with how many points makes a good tail drag
//     const points = [];
//     while(Math.abs(oldy - y ) <= 53){
//       points.push( new THREE.Vector3(x * multiplier, y * multiplier, z * multiplier) );
  
  
//       // acceleration = .5 * density of air * Velocity^2 * cross sectional area * drag coefficient
  
//       //using .3 as Drag Coefficient, see https://www.grc.nasa.gov/www/k-12/airplane/balldrag.html
//       //real range between .2 and .5 because of drag crisis
//       accY = (.5 * .0765 * .3 * Math.PI * Math.pow((1.437/12) , 2) * Math.pow(velY, 2)) / mass ;

//       //liftX = .15 *  (4 / 3  * ( 4 * Math.PI * Math.PI * (1.43/12) * (1.43/12) * (1.43/12) * rpm/60 * .01 * .0765 * velY));
//       liftX = .15 * .0765 * velY * 2 * Math.PI * Math.pow((1.437/12) , 2) * rpm /60/100 ;
//       accX = Math.cos(4.99) * (liftX * (1.43/12) * 2 * Math.PI/4) / mass;

//       //accX = B * (rpm / 60) / 100 * velY * Math.cos(spinAngle);
//       //accZ = B * rpm / 60 / 100 * velZ * Math.sin(spinAngle) - gravity/100;
  
//       console.log(x , y, z);
//       console.log("acc" + accX);
//       console.log("velo:" +  velX);
  
//       x += velX ;
//       y += velY ;
//       z += velZ ;
  
//       velX = velX + accX;
//       velY = velY + accY;
//       velZ = velZ;// + accZ;
  
//     }
//   console.log(points.length)
//   const geometry = new THREE.BufferGeometry().setFromPoints( points );
//   const line = new THREE.Line( geometry, material );
//   scene.add(line);
// }

export {create_line};