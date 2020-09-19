import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ground1 from './assets/models/ground1.gltf';

let model;

export async function factory() {
    const mesh = await createMesh();
    return mesh;
}

async function createMesh() {
    const model = await loadModel();
    return model.clone();
}

async function loadModel() {
    // TODO: separate mounts and ground for more control over the sizes
    if (model) return model;

    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load(ground1,
            function(gltf) {
                model = gltf.scene.children[0];
                model.scale.set(0.75, 0.75, 0.75);
                model.rotation.x = Math.PI / 2;
                model.position.set(0, -0.5, 0);
                model.children.forEach(child => child.receiveShadow = true);
                resolve(model);
            },
            undefined,
            reject
        );
    });
}

export function setGroundMaterial(groundModel, planeMaterial, mountsMaterial = planeMaterial) {
    groundModel.children[0].material = planeMaterial;
    groundModel.children[1].material = mountsMaterial;
}
