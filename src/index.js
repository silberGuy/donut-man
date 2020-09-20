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
const pauseButton = document.getElementById('pause-btn');
async function start() {
    const game = await initGame(renderer);
    let gameStarted = false;
    startGameButton.onclick = function() {
        startGame(renderer, game);
        landingMenu.classList.add('hidden');
        pauseButton.classList.remove('hidden');
        gameStarted = true;
    }

    continueButton.addEventListener('click', onContinueClick);
    pauseButton.addEventListener('click', onPauseClick);
    document.addEventListener('keyup', keyEvent => {
        // Escape
        if (keyEvent.keyCode === 27) {
            onPauseClick();
        }
        // Space
        if (keyEvent.keyCode === 32) {
            onContinueClick();
        }
    });
    
    function onContinueClick() {
        continueGame(game);
        pauseMenu.classList.add('hidden');
        pauseButton.classList.remove('hidden');
    }

    function onPauseClick() {
        if (!gameStarted) return;
        pauseGame(game);
        pauseButton.classList.add('hidden');
        pauseMenu.classList.remove('hidden');
    }
}

start();
