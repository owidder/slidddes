/* global slidAR, chartColors, Chart, d3 */

(function () {
    window._backAndFront_pie = function pie() {
        window._charts_pie("#backAndFront .flipper .one", 200, 200, "");
    }

    window._backAndFront_donut = function pie() {
        window._charts_donut("#backAndFront .flipper .two", 200, 200, "");
    }

    window._backAndFront_box = function () {
        var svg = d3.selectAll("#backAndFront .flipper")
            .append("svg")
            .attr("class", "background two")
            .attr("width", 200)
            .attr("height", 200)
            .attr("viewBox", "0 0 200 200")
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 200)
            .attr("height", 200)
            .attr("fill", "grey")
    }

    window._backAndFront_clean_pie = function _pie() {
        window._charts_clean("#backAndFront .flipper");
    }
})()