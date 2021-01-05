import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { baseballs, scene } from './index';

const loader = new GLTFLoader();
export var baseballs_GLTF: THREE.Group[] = [];
function loadModel(url: string) {
    return new Promise((resolve) => {
        loader.load(url, function (object) { resolve(object); });
    });
}
export async function add_baseballs() {
    var ball_GLTF: any, ball_mesh: any;

    for (var baseball in baseballs) {
        ball_GLTF = await loadModel('styles/baseball/Baseball.glb');
        ball_mesh = ball_GLTF.scene;
        scene.add(ball_mesh);

        baseballs_GLTF.push(ball_mesh);

        //ball_mesh.scale.set(.1 * 3/17, .1 * 3/17, .1 * 3/17); //actual baseball size
        ball_mesh.scale.set(.05, .05, .05);
        ball_mesh.position.set(parseInt(baseball) * 100, 0, 0);
    }
}
