import * as d3 from 'd3';

const create = (slideId, config) => {
    const selector = "#" + slideId;
    d3.select(selector)
        .append('img')
        .attr('src', config.pathToImage);

    return Promise.resolve();
}

export const imageSlide = {
    create
}

