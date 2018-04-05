/* global dynamics */

(function () {
    var dots = document.querySelectorAll('.dot')
    var colors = ['#007EFF', '#FF3700', '#92FF00']

    var paused = false;

// Start the 3 dot animations with different delays
    function animateDots() {
        for(var i=0; i<dots.length; i++) {
            dynamics.animate(dots[i], {
                translateY: -70,
                backgroundColor: colors[i]
            }, {
                type: dynamics.forceWithGravity,
                bounciness: 800,
                elasticity: 200,
                duration: 2000,
                delay: i * 450
            })
        }
        if(!paused) {
            dynamics.setTimeout(animateDots, 2500)
        }
    }

    animateDots()

    function doPause() {
        paused = true;
    }

    function doResume() {
        if(paused) {
            paused = false;
            animateDots();
        }
    }

    window._dynamics_add_pause_function(doPause);
    window._dynamics_add_resume_function(doResume);
})();
