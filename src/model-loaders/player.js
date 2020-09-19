'use strict';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as movable from '../movable.js';
import polyMan from '../assets/models/poly-man.gltf';

let model;

export async function factory() {
    const mesh = await createMesh();
    window.player = mesh;
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
        loader.load(polyMan,
            function(gltf) {
                model = gltf.scene.children[0];
                model.scale.set(0.02, 0.02, 0.02);
                resolve(model);
            },
            undefined,
            reject
        );
    });
}
