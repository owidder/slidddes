import {getArPositionRotation, setPositionRotationOnObject} from './arPositions';

const DEFAULT_DURATION = 1000;

// deprecated
const nextPositionAndRotation = (object) => {
    console.warn("nextPositionAndRotation is deprecated");

    const type = object._data.getType();
    const totalNum = object._data.getTotalNum();
    const nextIndex = object._data.getNextIndex();
    const positionFunction = object._data.getPositionFunction();
    const {position, rotation} = getArPositionRotation(type, nextIndex, totalNum, positionFunction);

    return {nextIndex, position, rotation}
}

const fwdBackPositionAndRotation = (object, trueIfFwd) => {
    const type = object._data.getType();
    const totalNum = object._data.getTotalNum();
    const nextIndex = trueIfFwd ? object._data.getPrevIndex() : object._data.getNextIndex();
    const positionFunction = object._data.getPositionFunction();
    const offset = object._data.getOffset();
    const {position, rotation} = getArPositionRotation(type, nextIndex, totalNum, positionFunction, offset);

    return {nextIndex, position, rotation}
}

const refreshPositionAndRotation = (object) => {
    const type = object._data.getType();
    const totalNum = object._data.getTotalNum();
    const index = object._data.getIndex();
    const positionFunction = object._data.getPositionFunction();
    const offset = object._data.getOffset();
    const {position, rotation} = getArPositionRotation(type, index, totalNum, positionFunction, offset);

    return {index, position, rotation}
}

export const tweenPosition = (position, newPosition, TWEEN, duration = DEFAULT_DURATION) => {
    new TWEEN.Tween({...position})
        .to({x: newPosition.x, y: newPosition.y, z: newPosition.z}, (1 + Math.random()) * duration)
        .onUpdate((position) => {

        })
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
}

export const moveTo = (object, newPosition, newRotation, TWEEN, duration = DEFAULT_DURATION) => {
    if(TWEEN) {
        const prom1 = new Promise((resolve) => {
            new TWEEN.Tween(object.position)
                .to({x: newPosition.x, y: newPosition.y, z: newPosition.z}, (1 + Math.random()) * duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onComplete(() => {
                    resolve();
                })
                .start();
        })

        const prom2 = new Promise((resolve) => {
            new TWEEN.Tween(object.rotation)
                .to({x: newRotation.x, y: newRotation.y, z: newRotation.z}, (1 + Math.random()) * duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onComplete(() => {
                    resolve();
                })
                .start();
        })

        const prom3 = new Promise((resolve) => {
            new TWEEN.Tween(this)
                .to( {}, duration * 2 )
                .onComplete(() => {
                    resolve();
                })
                .start();
        })

        return Promise.all([prom1, prom2, prom3]);
    }
    else {
        setPositionRotationOnObject(object, newPosition, newRotation);
        return Promise.resolve();
    }
}

// deprecated
export const next = (object, TWEEN) => {
    console.warn("next is deprecated");

    const {nextIndex, position, rotation} = nextPositionAndRotation(object);

    moveTo(object, position, rotation, TWEEN);

    object._data.setIndex(nextIndex);
}

export const fwd = (object, TWEEN) => {
    fwdBack(object, TWEEN, true)
}

export const back = (object, TWEEN) => {
    fwdBack(object, TWEEN, false)
}

const fwdBack = (object, TWEEN, trueIfFwd) => {
    return new Promise((resolve) => {
        const {nextIndex, position, rotation} = fwdBackPositionAndRotation(object, trueIfFwd);
        moveTo(object, position, rotation, TWEEN).then(() => {
            resolve();
        });
        object._data.setIndex(nextIndex);
    })
}

export const moveOffset = (object, TWEEN, offset) => {
    object._data.addToOffset(offset);
    const {position, rotation} = refreshPositionAndRotation(object);

    moveTo(object, position, rotation, TWEEN, 50);
}

export const allNext = (allObjects, TWEEN) => {
    allObjects.forEach((object) => {
        next(object, TWEEN);
    })
}

export const allFwdBack = (allObjects, TWEEN, trueIfFwd) => {
    const promises = [];
    allObjects.forEach((object) => {
        promises.push(fwdBack(object, TWEEN, trueIfFwd));
    })

    return Promise.all(promises);
}

export const allFwd = (allObjects, TWEEN) => {
    return allFwdBack(allObjects, TWEEN, true);
}

export const allBack = (allObjects, TWEEN) => {
    return allFwdBack(allObjects, TWEEN, false);
}

export const allMoveOffset = (allObjects, TWEEN, offset) => {
    allObjects.forEach((object) => {
        moveOffset(object, TWEEN, offset);
    })
}
