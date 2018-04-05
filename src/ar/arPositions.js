import * as _ from 'lodash';
import {THREE} from './threeHelper';

import {ObjectData} from './ObjectData';

export const TYPE_HELIX = "helix";
export const TYPE_SPHERE = "sphere";
export const TYPE_SPHERE_RANDOM = "sphere-random";
export const TYPE_RING = "ring";
export const TYPE_TABLE = "table";

export const DEFAULT_NUMBER_OF_POSSIBLE_PLACES = 50;
export const DEFAULT_NUMBER_PF_TABLE_COLUMNS = 3;

const addOffsetToPhaseFrom0To2 = (phase, offset = 0) => {
    const newPhase = (phase + (offset / 500)) % 2;
    return newPhase >= 0 ? newPhase : newPhase + 2;
}

export const randomSphereInit = (numberOfPossiblePlaces, radius) => {
    const shuffledPlaces = _.shuffle(_.range(0, numberOfPossiblePlaces-1));

    return (i, offset = 0) => {
        const phaseWithOffset = addOffsetToPhaseFrom0To2(2 * shuffledPlaces[i] / numberOfPossiblePlaces, offset);
        const phi = Math.acos(-1 + phaseWithOffset);
        const theta = Math.sqrt((numberOfPossiblePlaces - 1) * Math.PI) * phi;

        const random = new THREE.Object3D();
        random.position.x = radius * Math.cos(theta) * Math.sin(phi);
        random.position.y = radius * Math.sin(theta) * Math.sin(phi);
        random.position.z = radius * Math.cos(phi);

        const vector = new THREE.Vector3();
        vector.copy(random.position).multiplyScalar(-2);
        random.lookAt(vector);

        return random;
    }
};

export const randomSphere = randomSphereInit(DEFAULT_NUMBER_OF_POSSIBLE_PLACES);

const tableOffset = (offset = 0) => {
    return 10 * offset;
}

export const tableInit = (numberOfCols, _cellWidth, _cellHeight, _xOffset, _yOffset, _zOffset) => {
    return (i, offset = 0) => {
        const cellWidth = _.isUndefined(_cellWidth) ? 800 : _cellWidth;
        const cellHeight = _.isUndefined(_cellHeight) ? 400 : _cellHeight;
        const xOffset = _.isUndefined(_xOffset) ? -1330 : _xOffset;
        const yOffset = _.isUndefined(_yOffset) ? 990 : _yOffset;
        const zOffset = _.isUndefined(_zOffset) ? -1000 : _zOffset;
        const row = Math.floor(i / numberOfCols);
        const col = i % numberOfCols;
        const table = new THREE.Object3D();
        table.position.x = (col * cellWidth) + xOffset - tableOffset(offset);
        table.position.y = -(row * cellHeight) + yOffset;
        table.position.z = zOffset;

        return table;
    }
}

export const table = tableInit(DEFAULT_NUMBER_PF_TABLE_COLUMNS);

export const sphereInit = (radius) => {
    return (numberOfBodies, i, offset) => {
        return sphere(numberOfBodies, i, offset, radius);
    }
}

export const sphere = (numberOfBodies, i, offset = 0, radius = 800) => {
    const phaseWithOffset = addOffsetToPhaseFrom0To2(2 * i / numberOfBodies, offset);

    const phi = Math.acos(-1 + phaseWithOffset);
    const theta = Math.sqrt((numberOfBodies - 1) * Math.PI) * phi;

    const sphere = new THREE.Object3D();
    sphere.position.x = radius * Math.cos(theta) * Math.sin(phi);
    sphere.position.y = radius * Math.sin(theta) * Math.sin(phi);
    sphere.position.z = radius * Math.cos(phi);

    const vector = new THREE.Vector3();
    vector.copy(sphere.position).multiplyScalar(-2);
    sphere.lookAt(vector);

    return sphere
};

export const helix = (numberOfBodies, i, offset = 0) => {
    const phaseWithOffset = addOffsetToPhaseFrom0To2(2 * i / numberOfBodies, offset);

    const helix = new THREE.Object3D();
    const vector = new THREE.Vector3();
    const phi = phaseWithOffset * Math.PI;

    helix.position.x = 1000 * Math.sin(phi);
    helix.position.y = -(i * 8) + 500;
    helix.position.z = 1000 * Math.cos(phi);

    vector.x = -helix.position.x * 2;
    vector.y = -helix.position.y;
    vector.z = -helix.position.z * 2;

    helix.lookAt(vector);

    return helix;
};

export const ringInit = (radius) => {
    return (numberOfBodies, i, offset) => {
        return ring(numberOfBodies, i, offset, radius);
    }
}

export const ring = (numberOfBodies, i, offset = 0, radius = 3000) => {
    const phaseWithOffset = addOffsetToPhaseFrom0To2(2 * i / numberOfBodies, offset);

    const ring = new THREE.Object3D();
    const vector = new THREE.Vector3();
    const phi = phaseWithOffset * Math.PI;

    ring.position.x = radius * Math.sin(phi);
    ring.position.y = 100;
    ring.position.z = radius * Math.cos(phi);

    vector.x = -ring.position.x * 2;
    vector.y = -ring.position.y;
    vector.z = -ring.position.z * 2;

    ring.lookAt(vector);

    return ring;
};

export const setPositionRotationOnObject = (object, position, rotation) => {
    Object.assign(object.position, position);
    object.rotation.x = rotation.x;
    object.rotation.y = rotation.y;
    object.rotation.z = rotation.z;
}

const addToRoot = (element, root, position, rotation) => {
    const object = new THREE.CSS3DObject(element);

    setPositionRotationOnObject(object, position, rotation);
    root.add(object);

    return object;
}

export const getArPositionRotation = (type, i, num, positionFunction, offset) => {
    let three3dObject;

    switch (type) {
        case TYPE_HELIX:
             three3dObject = helix(num, i, offset);
             break;


        case TYPE_SPHERE:
            if(_.isFunction(positionFunction)) {
                three3dObject = positionFunction(num, i, offset);
            }
            else {
                three3dObject = sphere(num, i, offset);
            }
            break;


        case TYPE_RING:
            if(_.isFunction(positionFunction)) {
                three3dObject = positionFunction(num, i, offset);
            }
            else {
                three3dObject = ring(num, i, offset);
            }
            break;


        case TYPE_SPHERE_RANDOM:
            if(_.isFunction(positionFunction)) {
                three3dObject = positionFunction(i, offset);
            }
            else {
                three3dObject = randomSphere(i, offset);
            }
            break;

        case TYPE_TABLE:
            if(_.isFunction(positionFunction)) {
                three3dObject = positionFunction(i, offset);
            }
            else {
                three3dObject = table(i, offset);
            }
            break;

        default:
    }

    const {position, rotation} = three3dObject;
    return {position, rotation};
}

const addDataToObject = (object, type, index, totalNum, positionFunction) => {
    const objectData = new ObjectData(index, type, totalNum, positionFunction);
    object._data = objectData;
}

export const setArPositionRotation = (element, root, type, i, totalNum, positionFunction) => {
    const {position, rotation} = getArPositionRotation(type, i, totalNum, positionFunction);
    const object = addToRoot(element, root, position, rotation);
    addDataToObject(object, type, i, totalNum, positionFunction);

    return object;
}
