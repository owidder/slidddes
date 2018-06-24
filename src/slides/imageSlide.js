import * as _d3 from 'd3';
import './imageSlide.css';

const d3 = _d3;

const create = (slideId, config) => {
    const selector = "#" + slideId;
    d3.select(selector)
        .append('img')
        .attr("class", "img-slide")
        .attr('src', config.pathToImage);

    return Promise.resolve();
}

export const imageSlide = {
    create
}

