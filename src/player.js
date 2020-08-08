import {
    BoxGeometry,
    Mesh,
    MeshLambertMaterial,
} from 'three';
import * as movable from './movable.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let model;

export async function factory() {
    const mesh = await createMesh();
    return movable.decorate(mesh);
}

async function createMesh() {
    const geometry = new BoxGeometry(0.1, 0.1, 0.1);
    const material = new MeshLambertMaterial( { color: 0xA9E190 } );
    return new Mesh(geometry, material);
    // const model = await loadModel();
}

// async function loadModel() {
//     if (model) return model;

//     const loader = new GLTFLoader().setPath('/assets/models/');
//     return new Promise((resolve, reject) => {
//         loader.load('donut.gltf',
//             function(gltf) {
//                 model = gltf.scene.children[0];
//                 resolve(model);
//             },
//             undefined,
//             reject
//         );
//     });
// }
