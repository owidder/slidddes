import * as d3 from 'd3';

import './flipcounter.css';

import {guid} from '../../../util/random'
import {flipCounter} from './flipcounter';

const create = (containerSelector, start, durationInMs) => {
    const id = "_fc-" + guid();

    d3.select(containerSelector)
        .append("div")
        .attr("class", "clearfix")
        .append("div")
        .attr("class", "counter-wrapper")
        .append("ul")
        .attr("id", id)
        .attr("class", "flip-counter small");

    let _counterValue = start;
    const _flipcounter = new flipCounter(id, {value: _counterValue});

    setInterval(() => {
        _counterValue++;
        _flipcounter.setValue(_counterValue);
    }, durationInMs)
}

export const counter = {
    create
}