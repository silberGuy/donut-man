import {
    WebGLRenderer,
    // AxesHelper,
    PCFSoftShadowMap,
} from 'three';

import { initGame, startGame, pauseGame, continueGame } from './game.js';

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;   
document.body.prepend(renderer.domElement);

const landingMenu = document.getElementById("landing-menu");
const startGameButton = document.getElementById("start-btn");
const pauseMenu = document.getElementById("pause-menu");
const continueButton = document.getElementById("continue-btn");
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
