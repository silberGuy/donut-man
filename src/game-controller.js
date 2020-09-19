'use strict';

const { EventEmitter } = require('events');

export function GameController(gameRenderElement) {
    const eventEmitter = new EventEmitter();
    
    document.addEventListener('keydown', keyEvent => {
        if(keyEvent.code === 'ArrowRight') {
            eventEmitter.emit('right');
        }
        
        if(keyEvent.code === 'ArrowLeft') {
            eventEmitter.emit('left');
        }
    });
    
    gameRenderElement.addEventListener('touchstart', ({ touches }) => {
        if (touches.length === 1) {
            const { clientX } = touches[0];
            if (clientX > gameRenderElement.clientWidth / 2) {
                eventEmitter.emit('right');
            } else {
                eventEmitter.emit('left');
            }
        }
    });
    
    document.addEventListener('keyup', keyEvent => {
        eventEmitter.emit('keyup');
    });
    
    gameRenderElement.addEventListener('touchend', ({ touches }) => {
        if (touches.length === 0) {
            eventEmitter.emit('keyup');
        }
    });

    return eventEmitter;
}
