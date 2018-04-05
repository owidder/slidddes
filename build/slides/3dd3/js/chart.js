/* global slidAR, chartColors, Chart, $ */

(function () {

    var random0To100 = function() {
        return Math.round(Math.random() * 100);
    };

    window._charts_pie = function pie(selector, width, height, canvasClasses) {
        slidAR.canvas.addCanvas(selector, width, height, canvasClasses);
        var context = slidAR.canvas.getContext(selector);

        var config = {
            type: 'pie',
            data: {
                datasets: [{
                    data: [random0To100(), random0To100(), random0To100(), random0To100(), random0To100()],
                    backgroundColor: [chartColors.red, chartColors.orange, chartColors.yellow, chartColors.green, chartColors.blue],
                    label: 'Dataset 1'
                }],
                labels: ["Red", "Orange", "Yellow", "Green", "Blue"
                ]
            },
            options: {
                responsive: true
            }
        };

        new Chart(context, config);

        return context;
    }

    window._charts_donut = function (selector, width, height, canvasClasses) {
        slidAR.canvas.addCanvas(selector, width, height, canvasClasses);
        var context = slidAR.canvas.getContext(selector);

        var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [random0To100(), random0To100(), random0To100(), random0To100(), random0To100()],
                    backgroundColor: [chartColors.red, chartColors.orange, chartColors.yellow, chartColors.green, chartColors.blue],
                    label: 'Dataset 1'
                }],
                labels: ["Red", "Orange", "Yellow", "Green", "Blue"]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Doughnut Chart'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };

        new Chart(context, config);

        return context;
    }

    window._charts_clean = function (selector) {
        $(selector).empty();
    }
    
})()