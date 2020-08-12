import {
    AmbientLight,
    PointLight,
} from 'three';

export function initLights(scene) {
    const ambientLight = new AmbientLight( 0xffffff, 0.4 );
    scene.add(ambientLight);
    const light = new PointLight( 0xffffff, 1, 100 );
    light.position.set(-0.2, 1, 2);
    light.castShadow = true
    scene.add(light);
}