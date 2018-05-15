import {Slides} from '../Slides';
import {slidePlotly} from './slidePlotly';
import {htmlSlide, HtmlSlide} from '../htmlSlide';
import {appendScriptsWithReadyFunction} from '../../util/loadScript';
import {slideControl} from '../control/SlideControl';
import {slidarGlobal} from '../slidAR/slidarGlobal';

import * as query from '../../util/query';

const $ = window.$;

const paramFactor = query.paramValue("f");
const factor = Number(paramFactor || 2.0);

const width = slidarGlobal.width * factor;
const height = slidarGlobal.height * factor;

const createAnimeSlide = (slides, slideId) => {
    return htmlSlide(slideId, {
        pathToHtml: "slides/anime/anime.html",
        pathToJsArray: [
            "slides/anime/ymlarg.js",
            "slides/anime/index.js",
            "slides/anime/pressButtons.js",
        ],
        pathToCssArray: [
            "https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css",
            "slides/anime/ewxggx.css",
            "slides/anime/style.css"
        ],
        pauseFunction: () => {
            window._anime_pause();
        },
        resumeFunction: () => {
            window._anime_resume();
        }
    });
}

const createDynamicsSlide = (slides, slideId) => {
    return htmlSlide(slideId, {
        pathToHtml: "slides/dynamics/dynamics.html",
        pauseFunction: () => {
            window._dynamics_pause();
        },
        resumeFunction: () => {
            window._dynamics_resume();
        }
    })
}

const createVelocitySlide = (slides, slideId) => {
    const slide = new HtmlSlide(slideId, {
        pathToHtml: "slides/velocity/velocity.html",
        scriptThingyArray: [{
            pathToScript: "slides/velocity/index.js",
            readyFunction: () => {
                return window._velocity_ready;
            }
        }
        ],
        readyFunction: () => {
            return (typeof $('#SVGID_2_ stop').velocity === 'function');
        },
        pathToCssArray: [
            "https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css",
            "slides/velocity/style.css"
        ],
        startFunction: () => {
            window._velocity_start()
        },
        resetFunction: () => {
            window._velocity_reset();
            setTimeout(window._velocity_start, 2000);
        },
        pauseFunction: () => {
            slide.clearResetInterval();
        },
        resumeFunction: () => {
            start();
        }
    });
    const start = () => {
        slide.setResetInterval(15000);
    }
    start();
    
    return slide.getStartedPromise();
}

const createPlotlySlide = (slides, slideId) => {
    const config = slideControl.createAndRegisterConfig(slideId);

    appendScriptsWithReadyFunction(['lib/plotly.min.js'], () => window.Plotly, "wait for Plotly").then(() => {
        const plotlyDemo = slidePlotly(slideId);

        config.pauseFunction = () => {
            plotlyDemo.doPause();
        };
        config.resumeFunction = () => {
            plotlyDemo.doResume();
        };
    })
}

export const demoSlides = async (rootSelector) => {

    const slides = new Slides(rootSelector, width, height);
    const selection = slides.create(["anime", "velocity", "dynamics", "plotly"]);

    await Promise.all([
        createDynamicsSlide(slides, "dynamics"),
        createAnimeSlide(slides, "anime"),
        createVelocitySlide(slides, "velocity"),
        createPlotlySlide(slides, "plotly")
    ]);

    return selection;
}