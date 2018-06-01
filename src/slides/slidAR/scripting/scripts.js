import {slideControl} from '../../control/SlideControl';

const pause = (id, func) => {
    slideControl.getConfig(id).pauseFunction = func;
}

const resume = (id, func) => {
    slideControl.getConfig(id).resumeFunction = func;
}

export const scripts = {
    pause, resume
}
