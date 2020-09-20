import {
    Box3,
    Vector3,
} from 'three';

export function getSize(object) {
    const boundingBox = new Box3().setFromObject(object)
    const size = new Vector3();
    boundingBox.getSize(size);
    return size;
}

export function asyncWait(miliseconds) {
    return new Promise((resolve, _reject) => {
        setTimeout(resolve, miliseconds);
    })
}

export function isTouchDevice() {
    if ("ontouchstart" in window || window.TouchEvent) {
        return true;
    }

    if (window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }

    const prefixes = ["", "-webkit-", "-moz-", "-o-", "-ms-"];
    const queries = prefixes.map(prefix => `(${prefix}touch-enabled)`);

    return window.matchMedia(queries.join(",")).matches;
}