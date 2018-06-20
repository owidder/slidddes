import * as _ from 'lodash';

import * as transform from './transform';

const setXYZ = (newXYZ, currentXYZ) => {
    const x = _.isUndefined(newXYZ.x) ? currentXYZ.x : newXYZ.x;
    const y = _.isUndefined(newXYZ.y) ? currentXYZ.y : newXYZ.y;
    const z = _.isUndefined(newXYZ.z) ? currentXYZ.z : newXYZ.z;

    return {x, y, z}
}

export const toPosition = (object, newPosition, TWEEN, duration) => {
    const currentPosition = getPosition(object);
    const currentRotation = getRotation(object);
    const _newPosition = setXYZ(newPosition, currentPosition);

    transform.moveTo(object, _newPosition, currentRotation, TWEEN, duration);

    return currentPosition;
}

export const toRotation = (object, newRotation, TWEEN, duration) => {
    const currentPosition = getPosition(object);
    const currentRotation = getRotation(object);
    const _newRotation = setXYZ(newRotation, currentRotation);

    transform.moveTo(object, currentPosition, _newRotation, TWEEN, duration);

    return currentRotation;
}

export const getPosition = (object) => {
    const {x, y, z} = object.position;
    return {x, y, z};
}

export const getRotation = (object) => {
    const {x, y, z} = object.rotation;
    return {x, y, z};
}

