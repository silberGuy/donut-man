import { MeshStandardMaterial } from 'three';

import { setupScene } from './model-loaders/scene.js';
import { initLights } from './model-loaders/scene-lights.js';
import { factory as DonutFactory } from './model-loaders/donut.js';
import { factory as PlayerFactory } from './model-loaders/player.js';
import { factory as GroundFactory, setGroundMaterial } from './model-loaders/ground.js';
import { getSize, asyncWait } from './utils.js';

const GAME_STATES = {
    INIT: 0,
    PLAY: 1,
    PAUSE: 2,
    DONE: 3,
};

const INIT_DONUT_SPAWN_TIME = 1000;
const MAX_X = 1;
const MIN_X = -MAX_X;
const PLAYER_PADDING_FROM_EDGE = 0.2;
const LEVELS_GROUND_COLOR = [
    new MeshStandardMaterial( { color: 0xd3a930 } ),
    new MeshStandardMaterial( { color: 0x61963a } ),
    new MeshStandardMaterial( { color: 0x6d4317 } ),
    new MeshStandardMaterial( { color: 0x77d1ec } ),
    new MeshStandardMaterial( { color: 0xbd0895 } ),
    new MeshStandardMaterial( { color: 0xffe100 } ),
];

export class DonutMan {
    constructor(gameController) {
        // animateCallbacks: { cb: object }
        this.animateCallbacksMap = new Map();
        this.level = 1;
        this.gameController = gameController;
        this.initScene();
    }

    get donutSpawnTime() {
        return INIT_DONUT_SPAWN_TIME / this.level;
    }

    initScene() {
        const { scene, camera } = setupScene();
        this.scene = scene;
        this.camera = camera;
    
        initLights(this.scene);
    }

    async initGame() {
        await Promise.all([
            this.initGameEnviroment(),
            this.initPlayer(),
        ]);
        this.state = GAME_STATES.INIT;
    }

    async initGameEnviroment() {
        this.ground = await GroundFactory();
        this.ground.receiveShadow = true;
        setGroundMaterial(this.ground, LEVELS_GROUND_COLOR[0]);
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }
    
    async initPlayer() {
        this.player = await PlayerFactory();
        this.scene.add(this.player);
        this.player.position.y = -1.3;
        this.player.rotation.x = Math.PI / 2;
        const playerSize = getSize(this.player);
        // TODO: Set player anchor point at its bottom and delete this line
        this.player.position.z = playerSize.z;

        this.gameController.on('left', () => {
            if ((this.player.position.x - PLAYER_PADDING_FROM_EDGE) > MIN_X) {
                this.player.velocity.x = -0.01;
            } else {
                this.player.velocity.x = 0;
            }
        });

        this.gameController.on('right', () => {
            if ((this.player.position.x + PLAYER_PADDING_FROM_EDGE) < MAX_X) {
                this.player.velocity.x = 0.01;
            } else {
                this.player.velocity.x = 0;
            }
        });

        this.gameController.on('keyup', () => {
            this.player.velocity.x = 0;
        });

        this.addAnimateCallback(() => {
            if (this.state === GAME_STATES.PLAY) {
                this.player.animate();
            }
        }, this.player);
    }

    get animateCallbacks() {
        return this.animateCallbacksMap.keys();
    }

    addAnimateCallback(cb, object) {
        this.animateCallbacksMap.set(cb, object);
    }

    async startGame() {
        this.state = GAME_STATES.PLAY;
        const donutIteration = async () => {
            if (this.state === GAME_STATES.PLAY) {
                this.addDonut({
                    x: Math.random() * (MAX_X - MIN_X) + MIN_X,
                });
            }
            await asyncWait(this.donutSpawnTime);
            await donutIteration();
        }
        donutIteration();
    }

    get isPlaying() {
        return this.state === GAME_STATES.PLAY;
    }

    setLevel(level) {
        this.level = level;
        let planeMaterialIndex = 0;
        let mountsMaterialIndex = 0;
        if (level >= LEVELS_GROUND_COLOR.length) {
            planeMaterialIndex = Math.floor(Math.random() * LEVELS_GROUND_COLOR.length);
            mountsMaterialIndex = Math.floor(Math.random() * LEVELS_GROUND_COLOR.length);
        } else {
            planeMaterialIndex = mountsMaterialIndex = level - 1;
        }
        setGroundMaterial(this.ground, LEVELS_GROUND_COLOR[planeMaterialIndex], LEVELS_GROUND_COLOR[mountsMaterialIndex]);
    }

    pause() {
        this.state = GAME_STATES.PAUSE;
    }

    continue() {
        this.state = GAME_STATES.PLAY;
    }

    animate() {
        for (let cb of this.animateCallbacks) {
            cb();
        }
    }

    async addDonut({ x: initX }) {
        const donut = await DonutFactory();
        this.scene.add(donut);
        donut.rotation.z = Math.PI / 2;
        donut.position.z = 0.1;
        donut.position.y = 1.5;
        donut.position.x = initX;
        donut.accelaration.z = -0.00005;
        donut.velocity.z = 0.0075;
        donut.velocity.y = -0.005;

        const donutSize = getSize(donut);

        const rotationX = Math.random() * 0.1 + 0.02;
        this.addAnimateCallback(() => {
            if (this.state !== GAME_STATES.PLAY)  return;

            donut.rotation.x += rotationX;
            donut.animate();
            if (donut.position.z - donutSize.z / 2 < 0.01) {
                donut.velocity.z = Math.abs(donut.velocity.z);
            }
            if (donut.position.y < this.camera.position.y) {
                this.removeObject(donut);
            }
            if (this.player && donut.position.distanceTo(this.player.position) < 0.1) {
                // alert("game over");
                this.state = GAME_STATES.DONE;
            }
        }, donut);
    }

    removeObject(obj) {
        this.scene.remove(obj);
        this.animateCallbacksMap.forEach((v, k) => {
            if (v === obj) {
                this.animateCallbacksMap.delete(k);
            }
        })
    }
}
