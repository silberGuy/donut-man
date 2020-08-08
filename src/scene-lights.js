import {
    AmbientLight,
    PointLight,
} from 'three';

export function initLights(scene) {
    const ambientLight = new AmbientLight( 0x707070 );
    scene.add(ambientLight);
    const light = new PointLight( 0xffffff, 1, 1000 );
    light.position.set(-1.5, 1, 2);
    scene.add(light);
}