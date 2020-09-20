import {
    WebGLRenderer,
    PCFSoftShadowMap,
} from 'three';

import { initGame, startGame, pauseGame, continueGame } from './game.js';

const gameWrapper = document.getElementById('game-wrapper');
const renderer = new WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;   
gameWrapper.prepend(renderer.domElement);
window.addEventListener('load', resizeRenderer);
window.addEventListener('resize', resizeRenderer);
window.addEventListener('orientationchange', resizeRenderer);
function resizeRenderer() {
    renderer.setSize(gameWrapper.clientWidth, gameWrapper.clientHeight);
}

const landingMenu = document.getElementById('landing-menu');
const startGameButton = document.getElementById('start-btn');
const pauseMenu = document.getElementById('pause-menu');
const continueButton = document.getElementById('continue-btn');
async function start() {
    const game = await initGame(renderer);
    startGameButton.onclick = function() {
        startGame(renderer, game);
        landingMenu.classList.add('hidden');
    }

    continueButton.addEventListener('click', onContinueClick);
    document.addEventListener('keyup', keyEvent => {
        // Escape
        if (keyEvent.keyCode === 27) {
            pauseGame(game);
            pauseMenu.classList.remove('hidden');
        }
        // Space
        if (keyEvent.keyCode === 32) {
            onContinueClick();
        }
    });
    
    function onContinueClick() {
        continueGame(game);
        pauseMenu.classList.add('hidden');
    }
}

start();
