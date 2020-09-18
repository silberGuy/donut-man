import {
    WebGLRenderer,
    AxesHelper,
    PCFSoftShadowMap,
} from 'three';

import { Game } from './game.js';

const BASIC_LEVEL_DURATION = 15 * 1000;
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

function startGame(game) {
    const startTime = new Date();
    let currentLevel = 1;
    function animate() {
        requestAnimationFrame(animate);
        game.animate();
        renderer.render( game.scene, game.camera );
        if (game.isPlaying) {
            const timePassed = new Date() - startTime;
            updateTimer(timePassed);
            const level = Math.max(1, Math.ceil(timePassed / BASIC_LEVEL_DURATION * currentLevel));
            if (level > currentLevel) {
                currentLevel = level;
                setGameLevel(game, level);
            }
        }
    }

    animate();
    game.startGame();
}
startGame(game);

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
function updateTimer(timePassed) {
    const miliseconds = timePassed % 1000;
    const milisecondsString = `${timePassed % 100}`.padStart(2, '0');
    const seconds = (timePassed - miliseconds) / 1000;
    const secondsString = `${seconds}`.padStart(2, '0');
    timerElement.innerText = `${secondsString}:${milisecondsString}`;
}

const popupMessageElement = document.getElementById('main-popup-message');
function setGameLevel(game, level) {
    game.level = level;
    popupMessageElement.innerText = `LEVEL ${level}`;
    popupMessageElement.classList.add('animate');
    setTimeout(() => popupMessageElement.classList.remove('animate'), 1300);
    // TODO: update game colors according to level

}