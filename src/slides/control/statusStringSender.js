import * as _ from 'lodash';

import {slidddesGlobal} from '../slidddes/slidddesGlobal';
import {slideControl} from './SlideControl';
import * as wsSender from './wsSender';

const createStepPart = () => {
    const slideIds = slideControl.getSlideIds();
    const stepPartStr = slideIds.reduce((_stepPartStr, slideId) => {
        const stepsObject = slideControl.getStepsObject(slideId);
        if(!_.isUndefined(stepsObject)) {
            return _stepPartStr + (_stepPartStr.length > 0 ? "&" : "") + slideId + "=" + stepsObject.stepNumber;
        }
        else {
            return _stepPartStr;
        }
    }, "");

    return stepPartStr;
}

const createStatusString = (nextPrev) => {
    return createStepPart() + "#" + slideControl.getCurrentSlideId() + "#" + (nextPrev || "");
}

export const sendStatusString = (nextPrev) => {
    if(wsSender.isOnline() && slidddesGlobal.isMaster) {
        const statusString = createStatusString(nextPrev);
        const commandString = "status " + statusString;

        return wsSender.send(commandString);
    }
    else {
        return Promise.resolve();
    }
}
