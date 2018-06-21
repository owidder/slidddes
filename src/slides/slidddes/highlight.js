import './highlight.css';

import * as d3 from 'd3';

const HIGHLIGHT_CLASS = "_highlight_";
const BORDER_CLASS = "border";
const LIGHT_COLOR_CLASS = "light";
const DARK_COLOR_CLASS = "dark";
const ON_CLASS = "on";
const OFF_CLASS = "off";

const setRemoveClass = (selector, className, trueToSet) => {
    d3.selectAll(selector).classed(className, trueToSet);
}

const setClass = (selector, className) => {
    setRemoveClass(selector, className, true)
}

const removeClass = (selector, className) => {
    setRemoveClass(selector, className, false)
}

export const border = (selector, borderColorClass) => {
    setClass(selector, HIGHLIGHT_CLASS);
    setClass(selector, BORDER_CLASS);
    setClass(selector, borderColorClass);
}

export const lightBorder = (selector) => {
    border(selector, LIGHT_COLOR_CLASS)
}

export const darkBorder = (selector) => {
    border(selector, DARK_COLOR_CLASS);
}

export const animatedBorder = (selector, borderColorClass) => {
    setClass(selector, OFF_CLASS);
    border(selector, borderColorClass);
    setTimeout(() => {
        setClass(selector, ON_CLASS);
    })
}

export const removeBorder = (selector) => {
    removeClass(selector, HIGHLIGHT_CLASS);
    removeClass(selector, BORDER_CLASS);
    removeClass(selector, ON_CLASS);
}

export const animatedBorderStep = (selector, borderColorClass) => {
    return {
        f: () => animatedBorder(selector, borderColorClass),
        b: () => removeBorder(selector, borderColorClass)
    }
}

export const animatedBorderStepWithReverse = (selector, borderColorClass) => {
    const step = animatedBorderStep(selector, borderColorClass);
    const reverseStep = {
        f: step.b,
        b: step.f
    }

    return {step, reverseStep}
}

export const highlight = {
    animatedBorder,
    removeBorder,
    animatedBorderStep,
    animatedBorderStepWithReverse,
    LIGHT_COLOR_CLASS, DARK_COLOR_CLASS
};
