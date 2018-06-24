import * as _d3 from 'd3';
import './imageSlide.css';

const d3 = _d3;

const create = (slideId, config) => {
    return new Promise((resolve) => {
        const selector = "#" + slideId;
        d3.select(selector)
            .append('img')
            .attr("class", "img-slide");

        const imageElement = document.querySelector(selector + " .img-slide");
        const image = new Image();
        image.onload = function () {
            imageElement.src = this.src;
            resolve();
        }
        image.src = config.pathToImage;
    })
}

export const imageSlide = {
    create
}

