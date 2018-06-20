import * as _ from 'lodash';

import {slideControl} from '../control/SlideControl';
import {createReverseStep} from './steps';
import {slidarGlobal} from './slidarGlobal';
import * as move from '../../three/move';

const toPosition = (slideId, newPosition) => {
    const object = slideControl.getObject(slideId);
    return move.toPosition(object, newPosition, slidarGlobal.TWEEN)
}

const toRotation = (slideId, newRotation) => {
    const object = slideControl.getObject(slideId);
    return move.toRotation(object, newRotation, slidarGlobal.TWEEN)
}

const toPositionStepWithReverse = (slideId, newPosition) => {
    const step = {
        f: () => {
            if(_.isUndefined(this.currentPosition)) {
                this.currentPosition = getPosition(slideId);
            }
            toPosition(slideId, newPosition)
        },
        b: () => {
            toPosition(slideId, this.currentPosition)
        }
    }

    return createReverseStep(step);
}

const toRotationStepWithReverse = (slideId, newRotation) => {
    const step = {
        f: () => {
            if(_.isUndefined(this.currentRotation)) {
                const cr = getRotation(slideId);
                this.currentRotation = {};
                this.currentRotation.x = cr.x;
                this.currentRotation.y = cr.y;
                this.currentRotation.z = cr.z;
            }
            toRotation(slideId, newRotation)
        },
        b: () => {
            toRotation(slideId, this.currentRotation)
        }
    }

    return createReverseStep(step);
}

const toPositionRotation = (slideId, newPosition, newRotation) => {
    slideControl.moveToAbsolutePositionRotation(slideId, newPosition, newRotation);
}

const getPosition = (slideId) => {
    const object = slideControl.getObject(slideId);
    const {x, y, z} = object.position;
    return {x, y, z};
}

const getRotation = (slideId) => {
    const object = slideControl.getObject(slideId);
    const {x, y, z} = object.rotation;
    return {x, y, z};
}

export const positionRotation = {
    toPosition, toRotation, toPositionRotation,
    toPositionStepWithReverse,
    toRotationStepWithReverse,
    getPosition, getRotation
}