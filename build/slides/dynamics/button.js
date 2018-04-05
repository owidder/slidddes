/* global dynamics */

(function () {
    var el = document.querySelector('path')
    var textEl = document.querySelector('span')
    var pathOver = el.getAttribute('data-over-path')
    var pathOut = el.getAttribute('d')

    var paused = false;

// Over animation
    function animateOver() {
        if(!paused) {
            dynamics.animate(el, {
                d: pathOver,
                fill: "#007EFF"
            }, {
                type: dynamics.spring,
                complete: animateOut
            })

            dynamics.animate(textEl, {
                scale: 1.06
            }, {
                type: dynamics.spring
            })
        }
    }

// Out animation
    function animateOut() {
        dynamics.animate(el, {
            d: pathOut,
            fill: "#0bf"
        }, {
            type: dynamics.easeInOut,
            friction: 100
        })

        dynamics.animate(textEl, {
            scale: 1
        }, {
            type: dynamics.easeInOut,
            friction: 100,
            complete: function() {
                dynamics.setTimeout(animateOver, 500)
            }
        })
    }

    animateOver()

    function doPause() {
        paused = true;
    }

    function doResume() {
        if(paused) {
            paused = false;
            animateOver();
        }
    }

    window._dynamics_add_pause_function(doPause);
    window._dynamics_add_resume_function(doResume);
})();
