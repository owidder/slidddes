import * as d3 from 'd3';
import * as _ from 'lodash';

import './SvgField.css';

import {guid} from '../../../util/random';

const FIELD_PADDING = 15;
const DIM_X = 30;
const DIM_Y = 30;

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

const emptyFlattenedMatrix = () => {
    const flattenedMatrix = [];
    _.range(DIM_Y).forEach((y) => {
        _.range(DIM_X).forEach((x) => {
            const uuid = guid();
            const hash = "0";
            const id = "";
            flattenedMatrix.push({id, x, y, hash, uuid});
        })
    });

    return flattenedMatrix;
}

const flattenCoords = (x, y) => {
    return Number(y) * DIM_X + Number(x);
}

const idFromObjectWithXAndY = (obj) => {
    return "_" + obj.x + "_" + obj.y;
}

export class SvgField {

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

        this.flattenedMatrix = emptyFlattenedMatrix();
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
        const index = flattenCoords(position.x, position.y);
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
