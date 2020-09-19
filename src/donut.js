import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as movable from './movable.js';
import donut from './assets/models/donut.gltf';

let model;

export async function factory() {
    const mesh = await createMesh();
    mesh.castShadow = true;
    return movable.decorate(mesh);
}

async function createMesh() {
    const model = await loadModel();
    return model.clone();
}

async function loadModel() {
    if (model) return model;

    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load(donut,
            function(gltf) {
                model = gltf.scene.children[0];
                resolve(model);
            },
            undefined,
            reject
        );
    });
}