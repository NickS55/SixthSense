import * as THREE from 'three';
import { create_line } from './create_line';

export class Baseball {
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
        velX: number, velY: number, velZ: number, plate_x: number, plate_z: number
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

    create_tracer() {
        //create_line(this.axisRad, this.rpm, this.x, this.y, this.z, this.velX, this.velY, this.velZ, this.plate_x, this.plate_z);
        create_line();
    }

    set_axis() {
        var axis = new THREE.Vector3(Math.cos(this.axisRad), Math.sin(this.axisRad), 0);
        this.vector3Axis = axis.normalize();
    }
}
