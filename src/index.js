import {
    WebGLRenderer,
    AxesHelper,
} from 'three';

import { Game } from './game.js';

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const game = new Game();
// for debugging
window.game = game;

const axesHelper = new AxesHelper( 5 );
game.scene.add( axesHelper );


function animate() {
    requestAnimationFrame(animate);
    game.animate();
    renderer.render( game.scene, game.camera );
}
animate();
game.start();
