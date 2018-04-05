/* global $ */

$(document).ready(function() {

	function getRandomInt(min, max) {
  		return Math.floor(Math.random() * (max - min)) + min;
	}

	var star;

	function starGenerate(){
		
		for (var i = 0;i<100;i++) {
			var $star;
			$star = $('<div class="star"></div>');
			$('.stars').append($star);
		}

		star = $('.star');
		starAnimate();
	}

	function starAnimate(){
        var svgWidth = $('div.landscape').width();
        var svgHeight = $('div.landscape').height();

		star.velocity({
			scale: function() {
				return getRandomInt(50,120) + '%';
			},
			translateY: 
				function() {
					return getRandomInt(0,svgHeight/2.5) + 'px';
				},
			translateX: 
				function() {
					return getRandomInt(0,svgWidth) + 'px';
				},
			backgroundColorRed: function() {
				return getRandomInt(70,100) + '%';
			},
			backgroundColorGreen: function() {
				return getRandomInt(70,100) + '%';
			},
			backgroundColorBlue: function() {
				return getRandomInt(70,100) + '%';
			}
			},{
				duration:0,
			}
		).velocity({
			opacity:1
		},{
			duration:3000
		});
	}

	function hideStars(duration) {
	    star.css('opacity', 0);
    }

	function observeStars() {
		$('.tube').velocity({
			rotateZ: '30deg',
			rotateX: '-20deg',
			translateY: '210%'
		},{
			duration:0
		}).velocity({
			translateY: ['150%', '210%']
		},{
			duration:1000
		}).velocity({
			rotateZ: ['-40deg','30deg'],
			rotateX: ['20deg','-20deg']
		},{
			duration:3000
		});
	}

	function unobserveStars() {
//	    $('.tube').css('transform', 'rotateZ(30deg) rotateX(-20deg) translateY(210%)');
        $('.tube').velocity({
            rotateZ: '30deg',
            rotateX: '-20deg',
            translateY: '210%'
        });
    }

    var stopColors = {};
    function saveStopColors(id) {
        stopColors[id] = $('#' + id + ' stop').map(function () {
            return $(this).css('stop-color');
        })
    }

    function resetStopColors(id) {
        $('#' + id + ' stop').each(function (index) {
            $(this).css('stop-color', stopColors[id][index]);
        })
    }

    var fills = {};
    function saveFill(selector) {
        fills[selector] = $(selector).css('fill');
    }

    function resetFill(selector) {
        $(selector).css('fill', fills[selector]);
    }

    function addPx(base, toAdd) {
        return  parseFloat(base) + toAdd + "px";
    }

    var sunx;
    var suny;
    var svgidx;
    var svgidy;
    function saveSunPositions() {
        sunx = $('#Sun circle').attr("cx");
        suny = $('#Sun circle').attr("cy");
        svgidx = $('#SVGID_2_').attr("cx");
        svgidy = $('#SVGID_2_').attr("cy");
    }

    function resetSunPositions() {
/*
        $('#Sun circle').attr("cx", sunx);
        $('#Sun circle').attr("cy", suny);
        $('#SVGID_2_').attr("cx", svgidx);
        $('#SVGID_2_').attr("cy", svgidy);
*/

        $('#Sun circle, #SVGID_2_').velocity({
            cy: '-=900',
            cx: '+=400'
        },{
            easing:'easeOut',
            duration:1000
        });
    }

    var skyGradientTwilight = ['#ffeecc','#e29ae5','#869cee','#509aee','#4988e5'];

    var skyGradientEvening = ['#05257d','#03287d','#02389d','#0247c6','#015cc9'];

    var skyGradientNight = ['#05154d','#030005','#020005','#010005','#010005'];

    var sunGradient = ['#FFEE80','#FFC261','#FF5121','#05257d','#005cc9'];

    function start() {
        saveStopColors('SVGID_1_');
        saveStopColors('SVGID_2_');
        saveStopColors('SVGID_3_');

        saveFill('#Hills_in_Distance_1 path');
        saveFill('#Hills_in_Distance_2 path');
        saveFill('#River_Background rect');
        saveFill('#Distant_Left_Ridge path');
        saveFill('#Right_Ridge path');

        saveSunPositions();

        console.log("start sunset");
        setTimeout(function(){
            observeStars();
        },5500);

        setTimeout(function(){
            starGenerate();
        },6000);

        $('#SVGID_1_ stop').each(function(index){
            $(this).velocity({
                stopColor: skyGradientTwilight[index]
            },{
                easing:'easeOutQuart',
                duration:3000
            });
        }).each(function(index){
            $(this).velocity({
                stopColor: skyGradientEvening[index]
            },{
                easing:'linear',
                duration:1500
            });
        }).each(function(index){
            $(this).velocity({
                stopColor: skyGradientNight[index]
            },{
                easing:'linear',
                duration:2000
            });
        });

        $('#Hills_in_Distance_1 path').velocity({
            fill: '#1a2b20'
        },{
            easing:'linear',
            delay:1000,
            duration:5500
        });

        $('#Hills_in_Distance_2 path').velocity({
            fill: '#152142'
        },{
            easing:'linear',
            delay:1000,
            duration:5500
        });

        $('#River_Background rect').velocity({
            fill: '#509aee'
        },{
            easing:'linear',
            delay:2000,
            duration:2500
        });

        $('#Distant_Left_Ridge path').velocity({
            fill: '#416005'
        },{
            easing:'linear',
            delay:1000,
            duration:550
        }).velocity({
            fill: '#103B11'
        },{
            easing:'easeIn',
            delay:1500,
            duration:1500
        }).velocity({
            fill: '#12361e'
        },{
            easing:'linear',
            duration:1000
        });

        $('#Right_Ridge path').velocity({
            fill: '#416005'
        },{
            easing:'linear',
            delay:1000,
            duration:550
        }).velocity({
            fill: '#103B11'
        },{
            easing:'easeIn',
            delay:1500,
            duration:1500
        }).velocity({
            fill: '#12361e'
        },{
            easing:'linear',
            duration:1000
        });

        $('#SVGID_2_ stop').velocity({
            stopColor: sunGradient[0]
        },{
            easing:'linear',
            duration:2250,
            delay:700
        }).velocity({
            stopColor: sunGradient[1]
        },{
            easing:'linear',
            duration:1000
        }).velocity({
            stopColor: sunGradient[2]
        },{
            easing:'linear',
            duration:2250
        }).velocity({
            stopColor: sunGradient[3]
        },{
            easing:'linear',
            duration:1250
        });

        //river gradient animations
        $('#SVGID_3_ stop').velocity({
            stopColor: sunGradient[0]
        },{
            easing:'linear',
            duration:2250,
            delay:700
        }).velocity({
            stopColor: sunGradient[1]
        },{
            easing:'linear',
            duration:300,
        }).velocity({
            stopColor: '#ff8040'
        },{
            easing:'linear',
            duration:800,
            delay:700
        }).velocity({
            stopColor: '#364263'
        },{
            easing:'linear',
            duration:1250,
            delay:700
        });

        $('#Sun circle, #SVGID_2_').velocity({
            cy: '+=900',
            cx: '-=400'
        },{
            easing:'easeOut',
            duration:14000
        });
    }

    function reset() {
        hideStars();
        unobserveStars();

        resetFill('#Hills_in_Distance_1 path');
        resetFill('#Hills_in_Distance_2 path');
        resetFill('#River_Background rect');
        resetFill('#Distant_Left_Ridge path');
        resetFill('#Right_Ridge path');

        resetStopColors('SVGID_1_');
        resetStopColors('SVGID_2_');
        resetStopColors('SVGID_3_');

        resetSunPositions();
    }

    window._velocity_start = start;
    window._velocity_reset = reset;
    window._velocity_ready = true;
});