import * as d3 from 'd3';
import * as _ from 'lodash';

import './flipcounter.css';

import {guid} from '../../../util/random'
import {flipCounter} from './flipcounter';

const create = (containerSelector, start, durationInMsLower, durationInMsUpper) => {
    const id = "_fc-" + guid();

    d3.select(containerSelector)
        .append("div")
        .attr("class", "clearfix")
        .append("div")
        .attr("class", "counter-wrapper")
        .append("ul")
        .attr("id", id)
        .attr("class", "flip-counter small");

    const _flipcounter = new flipCounter(id, {value: start});

    _nextValue(durationInMsLower, durationInMsUpper, start, _flipcounter);
}

const _nextValue = (durationInMsLower, durationInMsUpper, counterValue, flipcounter) => {
    setTimeout(() => {
        flipcounter.setValue(counterValue);
        _nextValue(durationInMsLower, durationInMsUpper, counterValue+1, flipcounter);
    }, _.random(durationInMsLower, durationInMsUpper));
}

export const counter = {
    create
}