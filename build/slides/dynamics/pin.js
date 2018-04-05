/* global dynamics */

(function () {
    var svg = document.querySelector('.pin svg')
    var pin = document.querySelector('.pin')

    var paused = false;

    function horizontalBounce() {
        // The bounce animation will return to the original state
        // In this case, it will go from 0deg to -45deg to 0deg
        if(!paused) {
            dynamics.animate(pin, {
                rotateZ: -45
            }, {
                type: dynamics.bounce,
                duration: 1800,
                complete: verticalBounce
            })
        }
    }

    function verticalBounce() {
        // We animate the two elements (svg, pin) independently
        dynamics.animate(svg, {
            scaleY: 0.8
        }, {
            type: dynamics.bounce,
            duration: 800,
            bounciness: 0
        })

        // Use the delay option to delay your animations
        dynamics.animate(pin, {
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

    function doPause() {
        paused = true;
    }

    function doResume() {
        if(paused) {
            paused = false;
            horizontalBounce();
        }
    }

    window._dynamics_add_pause_function(doPause);
    window._dynamics_add_resume_function(doResume);
})();

