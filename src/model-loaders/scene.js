import {
    Scene,
    PerspectiveCamera,
    Color,
} from 'three';

export function setupScene() {
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.y = -2.06;
    camera.position.z = 0.5;
    camera.rotation.x = 1.5;
    
    scene.background = new Color( 0x87AFFF );
    return { scene, camera };
}
