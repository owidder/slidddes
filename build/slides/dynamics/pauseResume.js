(function () {
    const pauseFunctions = [];
    const resumeFunctions = [];

    function addPauseFunction(fct) {
        pauseFunctions.push(fct);
    }

    function addResumeFunction(fct) {
        resumeFunctions.push(fct);
    }

    function doPause() {
        pauseFunctions.forEach(function (pauseFunction) {
            pauseFunction();
        })

    }

    function doResume() {
        resumeFunctions.forEach(function (resumeFunction) {
            resumeFunction();
        })
    }

    window._dynamics_add_pause_function = addPauseFunction;
    window._dynamics_add_resume_function = addResumeFunction;
    window._dynamics_pause = doPause;
    window._dynamics_resume = doResume;
})();
