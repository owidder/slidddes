/* global dynamics */

(function () {
    var el = document.querySelector('#triangle')

    var paused = false;

// From purple to green
    function animate1() {
        if(!paused) {
            dynamics.animate(el, {
                rotateZ: 180,
                scale: 1.5,
                borderBottomColor: '#43F086'
            }, {
                type: dynamics.spring,
                friction: 400,
                duration: 1300,
                complete: animate2
            })
        }
    }

// From green to purple
    function animate2() {
        dynamics.animate(el, {
            rotateZ: 360,
            scale: 1,
            borderBottomColor: '#CA2F6F'
        }, {
            type: dynamics.spring,
            frequency: 600,
            friction: 400,
            duration: 1800,
            anticipationSize: 350,
            anticipationStrength: 400,
            complete: animate1
        })
    }

    animate1()

    function doPause() {
        paused = true;
    }

    function doResume() {
        if(paused) {
            paused = false;
            animate1();
        }
    }

    window._dynamics_add_pause_function(doPause);
    window._dynamics_add_resume_function(doResume);
})();

