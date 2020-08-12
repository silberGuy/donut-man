import {
    WebGLRenderer,
    AxesHelper,
    PCFSoftShadowMap,
} from 'three';

import { Game } from './game.js';

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;   
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
    if (game.isPlaying) {
        updateTimer();
    }
}
animate();
game.startGame();

document.addEventListener('keyup', keyEvent => {
    // Escape
    if (keyEvent.keyCode === 27) {
        // TODO: add menu popup
        game.pause();
    }
    // Space
    if (keyEvent.keyCode === 32) {
        game.continue();
    }
});

const timerElement = document.getElementById('timer');
const startTime = new Date();
function updateTimer() {
    const now = new Date();
    const time = now - startTime;
    const miliseconds = time % 1000;
    const seconds = (time - miliseconds) / 1000;
    timerElement.innerText = `${seconds}:${miliseconds}`;
}