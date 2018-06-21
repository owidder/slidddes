import * as d3 from 'd3';

export const getContext = (parentSelector) => {
    return document.querySelector(parentSelector + " canvas").getContext('2d')
}

export const clearContext = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);
}

export const addCanvas = (parentSelector, width, height, classes) => {
    const canvas = d3.selectAll(parentSelector)
        .append("canvas")
        .attr("class", classes)
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")

    return canvas.node();
}

export const canvas = {
    getContext,
    clearContext,
    addCanvas
}