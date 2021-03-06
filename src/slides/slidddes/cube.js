import * as d3 from 'd3';
import * as $ from 'jquery';

const vsprintf = require('sprintf-js').vsprintf;

export const SIDE_NAME_FRONT = "cube-front";
export const SIDE_NAME_BACK = "cube-back";
export const SIDE_NAME_TOP = "cube-top";
export const SIDE_NAME_BOTTOM = "cube-bottom";
export const SIDE_NAME_LEFT = "cube-left";
export const SIDE_NAME_RIGHT = "cube-right";

const front = {
    name: SIDE_NAME_FRONT,
    transform: "translateZ(%s)",
    color: "#d4e157"
}

const back = {
    name: SIDE_NAME_BACK,
    transform: "rotateY(-180deg) translateZ(%s)",
    color: "#0f9d58"
}

const left = {
    name: SIDE_NAME_LEFT,
    transform: "rotateY(-90deg) translateZ(%s)",
    color: "#37474f"
}

const right = {
    name: SIDE_NAME_RIGHT,
    transform: "rotateY(90deg) translateZ(%s)",
    color: "#880e4f"
}

const top = {
    name: SIDE_NAME_TOP,
    transform: "rotateX(90deg) translateZ(%s)",
    color: "#4a148c"
}

const bottom = {
    name: SIDE_NAME_BOTTOM,
    transform: "rotateX(-90deg) translateZ(%s)",
    color: "#9e9d24"
}

const containerStyles = (container, sizeInPx) => {
    const sizeStr = sizeInPx + "px";
    container
        .style("width", sizeStr)
        .style("height", sizeStr)
        .style("position", "absolute")
        .style("top", "40vh")
        .style("left", "40vw")
        .style("perspective", "800px")
}

const innerStyles = (inner) => {
    inner
        .style("width", "100%")
        .style("height", "100%")
        .style("position", "absolute")
        .style("transform-style", "preserve-3d")
}

const create = (containerSelector, sizeInPx) => {
    const sides = [front, back, top, bottom, left, right];

    const container = d3.selectAll(containerSelector);
    const inner = container
        .append("div")
        .attr("class", "_cube animate-cube")

    const selection = () => inner.selectAll("div._cube div.cube-side");

    selection()
        .data(sides)
        .enter()
        .append("div")
        .attr("class", (d) => "cube-side " + d.name)
        .style("border", "1px solid black")
        .style("background-color", "white")
        .style("opacity", .8)
        .style("width", "100%")
        .style("height", "100%")
        .style("position", "absolute")
        .style("margin", 0)
        .style("display", "block")
        .style("transform", (d) => vsprintf(d.transform, [(sizeInPx/2) + "px"]))

    containerStyles(container, sizeInPx);
    innerStyles(inner);

    return selection();
}

export const createWithCanvas = (containerSelector, sizeInPx) => {

    const selection = create(containerSelector, sizeInPx);
    selection
        .append("canvas")
        .attr("width", sizeInPx)
        .attr("height", sizeInPx)
        .style("display", "block")
}

export const remove = (containerSelector) => {
    $(containerSelector).empty();
}

export const createWithCanvasStep = (containerSelector, sizeInPx) => {
    return {
        f: () => createWithCanvas(containerSelector, sizeInPx),
        b: () => remove(containerSelector)
    }
}

export const startStopAnimation = (trueIfStart) => {
    d3.selectAll("div._cube")
        .classed("animate-cube", trueIfStart)
}

export const cube = {
    create,
    createWithCanvas,
    createWithCanvasStep,
    startStopAnimation
}
