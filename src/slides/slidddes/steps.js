import {slideControl} from '../control/SlideControl';
import {paramValue} from '../../util/query';
import {demo} from './demo';

export const createReverseStep = (step) => {
    const reverseStep = {f: step.b, b: step.f}
    return {step, reverseStep}
}

export const init = () => {
    const stepNum = paramValue("step");
    if(stepNum > 0) {
        slideControl.gotoStepOnCurrentSlide(stepNum);
    }
}

const doesDemoStepExist = (steps) => {
    const demoSteps = steps.filter((step) => {
        return step.demo;
    })

    return demoSteps.length > 0;
}

const goToDemoStep = (steps) => {
    if(doesDemoStepExist(steps)) {
        for(let i = 0; i < steps.length; i++) {
            const step = steps[i];
            step.f();
            if(step.demo) {
                break;
            }
        }
    }
}

export const set = (slideId, steps) => {
    slideControl.setStepsObject(slideId, steps);
    if(demo.is()) {
        goToDemoStep(steps);
    }
}

const doAll = (steps) => {
    steps.forEach((step) => step());
}

export const combineSteps = (steps) => {
    return {
        f: () => doAll(steps.map((step) => step.f)),
        b: () => doAll(steps.reverse().map((step) => step.b))
    }
}

export const combine2StepsDelayed = (step1, step2, delay) => {
    return {
        f: () => {
            step1.f();
            setTimeout(() => {
                step2.f();
            }, delay);
        },
        b: () => {
            step1.b();
            step2.b();
        }
    }
}

export const steps = {
    set,
    combineSteps,
    combine2StepsDelayed,
    createReverseStep
}
