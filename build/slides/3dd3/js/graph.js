/* global slidAR */
/* global Chart */
/* global chartColors */
/* global d3 */
/* global $ */
/* global dynamics */

(function () {
    window._graph_pie = function pie() {
        window._charts_pie("#graphcube .front", 200, 200);
    }

    window._graph_donut = function () {
        window._charts_donut("#graphcube .right", 200, 200)
    }

    window._graph_clean_pie = function () {
        window._charts_clean("#graphcube .front");
    }

    window._graph_clean_donut = function () {
        window._charts_clean("#graphcube .right");
    }

    window._graph_pin = function () {
        var svg = d3.selectAll("#graphcube .top")
            .append("svg")
            .attr("width", 200)
            .attr("height", 200)
            .attr("viewBox", "0 0 200 200")

        var g = svg.append("g")
            .attr("transform", "translate(50,50)")

        g.append("path")
            .attr("d", "M38 106.7c2.4 0 37.7-43 37.8-68.8 0-21-17-38-38-38C17 0 0 17 0 38c.4 27 35.4 68.7 38 68.7z")
            .attr("fill", "#EC1A0A")

        g.append("ellipse")
            .attr("fill", "#FFF")
            .attr("cx", "38.1")
            .attr("cy", "38.1")
            .attr("rx", "23.1")
            .attr("ry", "23.1")

    }

    var paused = false;

    window._graph_pin_animate = function () {
        paused = false;
        var svg = document.querySelector('#graphcube .top svg')
        var div = document.querySelector('#graphcube .top')

        function horizontalBounce() {
            if(!paused) {
                dynamics.animate(div, {
                    rotateZ: -45
                }, {
                    type: dynamics.bounce,
                    duration: 1800,
                    complete: verticalBounce
                })
            }
        }

        function verticalBounce() {
            dynamics.animate(svg, {
                scaleY: 0.8
            }, {
                type: dynamics.bounce,
                duration: 800,
                bounciness: 0
            })

            dynamics.animate(div, {
                translateY: -60
            }, {
                type: dynamics.forceWithGravity,
                bounciness: 0,
                duration: 500,
                delay: 150
            })

            dynamics.animate(svg, {
                scaleY: 0.8
            }, {
                type: dynamics.bounce,
                duration: 800,
                bounciness: 600,
                delay: 650,
                complete: horizontalBounce
            })
        }

        horizontalBounce()
    }

    window._graph_pin_stop_animate = function () {
        paused = true;
    }

    window._graph_clean_pin = function () {
        $("#graphcube .top").empty();
    }
})()

