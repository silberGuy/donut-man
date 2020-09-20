import { DonutMan } from './donut-man.js';
import { GameController } from './game-controller.js';
import { isTouchDevice } from './utils.js';

const BASIC_LEVEL_DURATION = 15 * 1000;

export async function initGame(renderer) {
    const gameController = GameController(renderer.domElement);
    const game = new DonutMan(gameController);
    // for debugging
    window.game = game;
    await game.initGame();
    renderer.render( game.scene, game.camera );

    return game;
}

export function startGame(renderer, game) {
    const startTime = new Date();
    let currentLevel = 1;
    popupMessage(isTouchDevice() ? 'touch sides to move' : 'arrows to move');
    function animate() {
        requestAnimationFrame(animate);
        game.animate();
        renderer.render( game.scene, game.camera );
        if (game.isPlaying) {
            const timePassed = new Date() - startTime;
            updateTimer(timePassed);
            const level = Math.max(1, Math.ceil(timePassed / BASIC_LEVEL_DURATION));
            if (level > currentLevel) {
                currentLevel = level;
                setGameLevel(game, level);
            }
        }
    }

    animate();
    game.startGame();
    game.setLevel(currentLevel);
}

export function pauseGame(game) {
    game.pause();
}

export function continueGame(game) {
    game.continue();
}

const timerElement = document.getElementById('timer');
function updateTimer(timePassed) {
    const miliseconds = timePassed % 1000;
    const milisecondsString = `${timePassed % 100}`.padStart(2, '0');
    const seconds = (timePassed - miliseconds) / 1000;
    const secondsString = `${seconds}`.padStart(2, '0');
    timerElement.innerText = `${secondsString}:${milisecondsString}`;
}

function setGameLevel(game, level) {
    game.setLevel(level);
    popupMessage(`LEVEL ${level}`);
}

const popupMessageElement = document.getElementById('main-popup-message');
function popupMessage(msg) {
    popupMessageElement.innerText = msg;
    popupMessageElement.classList.add('animate');
    setTimeout(() => popupMessageElement.classList.remove('animate'), 1300);
}