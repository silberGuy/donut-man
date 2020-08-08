import {
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh,
    Box3,
} from 'three';

import { setupScene } from './scene.js';
import { initLights } from './scene-lights.js';
import { factory as DonutFactory } from './donut.js';
import { factory as PlayerFactory } from './player.js';

export class Game {
    constructor() {
        this.initScene();
        this.initGameEnviroment();

        // animateCallbacks: { cb: object }
        this.animateCallbacksMap = new Map();
    }

    initScene() {
        const { scene, camera } = setupScene();
        this.scene = scene;
        this.camera = camera;
    
        initLights(this.scene);
    }

    initGameEnviroment() {
        const planeGeometry = new PlaneGeometry(6, 3, 3);
        const material = new MeshBasicMaterial( { color: 0x2a2325 } );
        this.ground = new Mesh(planeGeometry, material);
        this.scene.add(this.ground);
    }
    
    async initPlayer() {
        this.player = await PlayerFactory();
        this.scene.add(this.player);
        this.player.position.y = -1.3;
        this.player.position.z = 0.05;

        document.addEventListener('keydown', keyEvent => {
            if(keyEvent.code === 'ArrowRight') {
                this.player.velocity.x = 0.01;
            }

            if(keyEvent.code === 'ArrowLeft') {
                this.player.velocity.x = -0.01;
            }
        });

        document.addEventListener('keyup', keyEvent => {
                this.player.velocity.x = 0;
        });

        this.addAnimateCallback(() => {
            this.player.animate();
        }, this.player);
    }

    get animateCallbacks() {
        return this.animateCallbacksMap.keys();
    }

    addAnimateCallback(cb, object) {
        this.animateCallbacksMap.set(cb, object);
    }

    async start() {
        await this.initPlayer();
        setInterval(() => {
            this.addDonut({
                x: Math.random() * 3 - 1.5,
            });
        }, 1000);
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

        const boundingBox = new Box3().setFromObject(donut)
        const donutSize = boundingBox.getSize() // Returns Vector3

        const rotationX = Math.random() * 0.1 + 0.02;
        this.addAnimateCallback(() => {
            donut.rotation.x += rotationX;
            donut.animate();
            if (donut.position.z - donutSize.z / 2 < 0.01) {
                donut.velocity.z = Math.abs(donut.velocity.z);
            }
            if (donut.position.y < this.camera.position.y) {
                this.removeObject(donut);
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
