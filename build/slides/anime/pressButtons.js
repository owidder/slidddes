(function () {
    var currentButtons;
    var currentIndex;
    var pauseFlag = false;

    function pressButtonDelayedAndRecursive(buttons, index) {
        currentButtons = buttons;
        currentIndex = index;

        setTimeout(function () {
            if(!pauseFlag) {
                buttons.item(index).click();
                pressButtonDelayedAndRecursive(buttons, index < buttons.length-1 ? index+1 : 0);
            }
            else {
                console.log("is paused");
            }
        }, 5000)
    }


    var buttons = document.querySelectorAll("button");
    pressButtonDelayedAndRecursive(buttons, 1);

    function pause() {
        pauseFlag = true;
        console.log("timeline pause");
        window._anime_timeline.pause();
    }

    function resume() {
        if(pauseFlag) {
            pauseFlag = false;
            pressButtonDelayedAndRecursive(currentButtons, currentIndex);
        }
        console.log("timeline play");
        window._anime_timeline.play();
    }

    window._anime_pause = pause;
    window._anime_resume = resume;
})();

