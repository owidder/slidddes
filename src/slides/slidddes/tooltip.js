import Tooltip from 'tooltip.js';
import * as d3 from 'd3';
import * as _ from 'lodash';

import * as domData from './domData';

export const TOP = "top";
export const BOTTOM = "bottom";
export const RIGHT = "right";
export const LEFT = "left";

const $ = window.$;

const tooltipAttribute = (attributeName) => {
    return "tooltip-" + attributeName;
}

export const create = (title, selector, placement) => {
    d3.selectAll(selector)
        .each(function (_dummy, i) {
            const instance = new Tooltip(this, {title, placement});
            domData.addAttributeToDomElement(this, tooltipAttribute(placement), instance);
            instance.show();
        })
}

export const remove = (selector, placement) => {
    d3.selectAll(selector)
        .each(function (_dummy, i) {
            const instance = domData.getAttributeFromDomElement(this, tooltipAttribute(placement));
            if(!_.isEmpty(instance)) {
                instance.dispose();
            }
        })
}

export const createPt = (title, selector, position) => {
    $(selector).protipShow({
        title,
        position,
        target: true,
        size: 'big',
        scheme: 'blue'
    })
}

export const removePt = (selector) => {
    $(selector).protipHide();
}

export const createPtStep = (title, selector, position) => {
    return {
        f: () => createPt(title, selector, position),
        b: () => removePt(selector)
    }
}

export const createPtStepWithReverse = (title, selector, position) => {
    const step = createPtStep(title, selector, position);
    const reverseStep = {
        f: step.b,
        b: step.f
    }

    return {step, reverseStep}
}

export const tooltip = {
    createPt,
    createPtStep,
    createPtStepWithReverse,
    removePt,
    create,
    remove,
    TOP, BOTTOM, RIGHT, LEFT
}
