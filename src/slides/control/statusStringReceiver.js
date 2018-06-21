import * as _ from 'lodash';

import {COMMAND_NEXT, COMMAND_PREV} from './commandExecutor';
import {slideControl} from './SlideControl';
import {slidarGlobal} from "../slidddes/slidarGlobal";

const oneStep = (oneStepStr) => {
    const pair = oneStepStr.split("=");
    if(pair.length > 1) {
        slideControl.gotoStep(pair[0], pair[1]);
    }
}

const parseStepPart = (stepPartString) => {
    const steps = stepPartString.split("&");
    steps.forEach((oneStepStr) => oneStep(oneStepStr));
}

const parseCurrentIdPart = (currentIdPartStr) => {
    if(!_.isEmpty(currentIdPartStr)) {
        slideControl.gotoSlide(currentIdPartStr);
    }
}

const parseNextPrevPart = (nextPrevPartStr) => {
    if(slidarGlobal.with3d) {
        switch (nextPrevPartStr) {
            case COMMAND_NEXT:
                slideControl.fwdSlide();
                break;

            case COMMAND_PREV:
                slideControl.backSlide();
                break;

            default:
            // do nothing
        }
    }
}

export const parse = (statusString) => {
    if(!slidarGlobal.isMaster) {
        const parts = statusString.split("#");

        parseStepPart(parts[0]);
        parseCurrentIdPart(parts[1]);
        if(slidarGlobal.useArgon) {
            parseNextPrevPart(parts[2]);
        }
    }
}
