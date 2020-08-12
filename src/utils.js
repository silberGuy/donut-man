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