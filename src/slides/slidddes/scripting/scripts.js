import * as _ from 'lodash';

import {
    slideControl,
    PAUSE_FUNCTION,
    RESUME_FUNCTION,
    SLIDE_EXIT_FUNCTION,
    SLIDE_ENTER_FUNCTION
} from '../../control/SlideControl';

const stopFunctions = {};

const pause = (id, func) => {
    slideControl.getConfig(id)[PAUSE_FUNCTION] = func;
}

const resume = (id, func) => {
    slideControl.getConfig(id)[RESUME_FUNCTION] = func;
}

const slideExit = (id, func) => {
    slideControl.getConfig(id)[SLIDE_EXIT_FUNCTION] = func;
}

const slideEnter = (id, func) => {
    slideControl.getConfig(id)[SLIDE_ENTER_FUNCTION] = func;
}

const registerStopFunction = (slideId, func) => {
    if(_.isUndefined(stopFunctions[slideId])) {
        stopFunctions[slideId] = [];
    }
    stopFunctions[slideId].push(func);
}

const stopAllScriptsForSlideId = (slideId) => {
    stopFunctions[slideId].forEach((func) => func());
}

export const scripts = {
    pause, resume,
    slideEnter, slideExit,
    registerStopFunction, stopAllScriptsForSlideId,
}
