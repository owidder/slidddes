import * as d3 from 'd3';

const create = (slideId, pathOrUrl) => {

    const selector = "#" + slideId;
    d3.select(selector)
        .append('img')
        .attr('src', pathOrUrl);
}

export const imageSlide = {
    create
}
