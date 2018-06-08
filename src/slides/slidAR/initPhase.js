import * as _ from 'lodash';

const slideReadyStates = {}

const slideReadyCheckFunctions = [];

const checkPromises = () => {
    const numberOfSlidesReady = _.values(slideReadyStates).length;
    slideReadyCheckFunctions.forEach((checkFunction) => checkFunction(numberOfSlidesReady));
}

const waitForNumberOfSlides = (numberOfSlidesToWaitFor) => {
    return new Promise((resolve) => {
        const checkFunction = (numberOfSlidesReady) => {
            if(numberOfSlidesReady >= numberOfSlidesToWaitFor) {
                resolve();
            }
        }

        slideReadyCheckFunctions.push(checkFunction);
    })
}

const markSlideAsReady = (slideId) => {
    slideReadyStates[slideId] = true;
    checkPromises();
}

export const initPhase = {
    waitForNumberOfSlides, markSlideAsReady,
}