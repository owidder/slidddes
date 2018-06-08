import * as d3 from 'd3';
import * as _ from 'lodash';

import './SvgField.css';

import {guid} from '../../../util/random';

const FIELD_PADDING = 15;
const DEFAULT_DIM_X = 30;
const DEFAULT_DIM_Y = 30;

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

const emptyFlattenedMatrix = (dimX, dimY) => {
    const flattenedMatrix = [];
    _.range(dimY).forEach((y) => {
        _.range(dimX).forEach((x) => {
            const uuid = guid();
            const hash = "0";
            const id = "";
            flattenedMatrix.push({id, x, y, hash, uuid});
        })
    });

    return flattenedMatrix;
}

const flattenCoords = (x, y, dimX) => {
    return Number(y) * dimX + Number(x);
}

const idFromObjectWithXAndY = (obj) => {
    return "_" + obj.x + "_" + obj.y;
}

export class SvgField {

    constructor(selector, width, height, dimX, dimY) {
        this.width = width;
        this.height = height;
        this.dimX = dimX ? dimX : DEFAULT_DIM_X;
        this.dimY = dimY ? dimY : DEFAULT_DIM_Y;

        const _tileWidth = width / this.dimX;
        const _tileHeight = height / this.dimY;
        this.tileSize = Math.min(_tileHeight, _tileWidth);
        this.fieldWidth = this.tileSize * this.dimX;
        this.fieldHeight = this.tileSize * this.dimY;

        this.initSvg(selector);
        this.initAxes();

        this.flattenedMatrix = emptyFlattenedMatrix(this.dimX, this.dimY);
        this.history = {};
    }

    initSvg(selector) {
        const self = this;

        const svg = d3.select(selector)
            .append("svg")
            .attr("class", "svg-field")
            .style("margin", "5px")
            .attr("width", self.width + FIELD_PADDING*2)
            .attr("height", self.height + FIELD_PADDING*2)

        this.gfield = svg.append("g")
            .attr("class", "field")
            .attr("transform", "translate(" + FIELD_PADDING + ", " + FIELD_PADDING + ")");
        this.grects = this.gfield.append("g").attr("class", "lines");
        this.gaxes = this.gfield.append("g").attr("class", "axes");
        this.svg = svg;
    }

    clear(parentSelector) {
        d3.selectAll(parentSelector + " .svg-field")
            .remove();
    }

    removeSvg() {
        const self = this;

        return new Promise((resolve) => {
            this.grects.selectAll("rect.position")
                .data([])
                .exit()
                .transition()
                .duration(2000)
                .style("opacity", 0);

            setTimeout(() => {
                self.svg.remove();
                resolve();
            }, 2500);
        })
    }

    initAxes() {
        const self = this;
        this.xScale = d3.scaleLinear()
            .domain([0, this.dimX])
            .range([0, self.fieldWidth]);

        this.yScale = d3.scaleLinear()
            .domain([0, this.dimY])
            .range([0, self.fieldHeight]);

        this.xAxis = d3.axisBottom(self.xScale)
            .ticks(this.dimX + 1)
            .tickSize(self.fieldHeight)
            .tickPadding(-FIELD_PADDING - this.fieldHeight);

        this.yAxis = d3.axisRight(self.yScale)
            .ticks(this.dimY + 1)
            .tickSize(self.fieldWidth)
            .tickPadding(-FIELD_PADDING - this.fieldWidth);

        this.gxaxis = this.gaxes.append("g")
            .attr("class", "axis axis-x")
            .call(self.xAxis);

        this.gyaxis = this.gaxes.append("g")
            .attr("class", "axis axis-y")
            .call(self.yAxis);

        this.removeAxisLabels(".axis-x");
        this.removeAxisLabels(".axis-y");
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

    putInHistory(position) {
        const id = idFromObjectWithXAndY(position);
        if(_.isUndefined(this.history[id])) {
            this.history[id] = [position];
        }
        else {
            this.history[id].push(position);
        }
    }

    getHistoryIncludingCurrentPosition(position) {
        const id = idFromObjectWithXAndY(position);
        const history = this.history[id];
        if(_.isEmpty(history)) {
            return [position];
        }
        return [...history, position];
    }

    getAllIdsFromPosition(position) {
        const history = this.getHistoryIncludingCurrentPosition(position);
        return history.map(position => position.id);
    }

    xcoord(xpos) {
        return xpos * this.tileSize;
    }

    ycoord(ypos) {
        return ypos * this.tileSize;
    }

    newPosition(position) {
        const index = flattenCoords(position.x, position.y, this.dimX);
        const currentPositionAtIndex = this.flattenedMatrix[index];
        if(!_.isEmpty(currentPositionAtIndex.id)) {
            this.putInHistory(currentPositionAtIndex);
        }
        this.flattenedMatrix[index] = position;
        this.drawMatrix();
    }

    removeAllHeads() {
        this.grects.selectAll(".head")
            .classed("head", false);
    }

    addHead(head) {
        const xyClass = idFromObjectWithXAndY(head);
        this.grects.selectAll("." + xyClass)
            .classed("head", true);
    }

    drawHeads() {
        this.removeAllHeads();
        _.values(this.heads).forEach((head) => {
            this.addHead(head);
        })
    }

    newHeads(heads) {
        this.heads = heads;
        this.drawHeads();
    }

    isHead(x, y) {
        let isHead = false;
        _.values(this.heads).forEach((head) => {
            if(head.x === x && head.y === y) {
                isHead = true;
            }
        });

        return isHead;
    }

    getRects() {
        return this.gfield.selectAll("rect.position");
    }

    highlight(id, trueForOn) {
        this.grects.selectAll(".position." + id)
            .classed("highlight", trueForOn);
    }

    drawMatrix() {
        const self = this;

        const data = this.grects.selectAll("rect.position").data(this.flattenedMatrix, d => d.x + "-" + d.y);

        data.enter()
            .append("rect")
            .attr("width", this.tileSize)
            .attr("height", this.tileSize)
            .attr("x", d => this.xcoord(d.x))
            .attr("y", d => this.ycoord(d.y))
            .merge(data)
            .attr("fill", d => _.isEmpty(d.id) ? "white" : colorScale(d.id))
            .attr("class", d => "position " + idFromObjectWithXAndY(d) + " " + self.getAllIdsFromPosition(d).join(" "))

        this.drawHeads();
    }

}
