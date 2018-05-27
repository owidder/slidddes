import * as d3 from 'd3';

const FIELD_PADDING = 15;
const DIM_X = 10;
const DIM_Y = 10;

export class Snakes {

    constructor(selector, width, height) {
        this.width = width;
        this.height = height;

        const _tileWidth = width / DIM_X;
        const _tileHeight = height / DIM_Y;
        this.tileSize = Math.min(_tileHeight, _tileWidth);
        this.fieldWidth = this.tileSize * DIM_X;
        this.fieldHeight = this.tileSize * DIM_Y;

        this.initSvg(selector);
        this.initAxes();
    }

    initSvg(selector) {
        const self = this;

        const svg = d3.select(selector)
            .append("svg")
            .style("margin", "5px")
            .attr("width", self.width + FIELD_PADDING*2)
            .attr("height", self.height + FIELD_PADDING*2)

        this.gfield = svg.append("g")
            .attr("class", "field")
            .attr("transform", "translate(" + FIELD_PADDING + ", " + FIELD_PADDING + ")");
        this.grects = this.gfield.append("g").attr("class", "lines");
        this.gaxes = this.gfield.append("g").attr("class", "axes");
    }

    initAxes() {
        const self = this;
        this.xScale = d3.scaleLinear()
            .domain([0, DIM_X])
            .range([0, self.fieldWidth]);

        this.yScale = d3.scaleLinear()
            .domain([0, DIM_Y])
            .range([0, self.fieldHeight]);

        this.xAxis = d3.axisBottom(self.xScale)
            .ticks(DIM_X + 1)
            .tickSize(self.fieldHeight)
            .tickPadding(-FIELD_PADDING - this.fieldHeight);

        this.yAxis = d3.axisRight(self.yScale)
            .ticks(DIM_Y + 1)
            .tickSize(self.fieldWidth)
            .tickPadding(-FIELD_PADDING - this.fieldWidth);

        this.gxaxis = this.gaxes.append("g")
            .attr("class", "axis axis-x")
            .call(self.xAxis);

        this.gyaxis = this.gaxes.append("g")
            .attr("class", "axis axis-y")
            .call(self.yAxis);
    }

    removeAxisLabels(axisSelector) {
        const textNodes = this.gaxes.selectAll(axisSelector + " text")
            .each(function () {
                const textNode = d3.select(this);
                const number = Number(textNode.text());
                if(number % 10 != 0) {
                    textNode.remove();
                }
            })
    }
}
