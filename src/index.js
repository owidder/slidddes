import 'materialize-css/dist/css/materialize.css';

import * as query from './util/query';

import {initCubes} from './cubes/cubesIndex';
import {initRadars} from './radar/radarsIndex';
import {initSlides} from './slides/slidesIndex';
import {demoSlides} from "./slides/demoSlides/demoSlides";
import * as dbar from "./slides/dbar/dbar";
import * as slowSnakes from "./slides/slowSnakes/slowSnakes";

import {appendStyles} from './util/loadStyles';

import {slidAR} from './slides/slidAR/slidAR';
import {simplAR} from './simplAR/simplAR';
import {slidarGlobal} from './slides/slidAR/slidarGlobal';
window.slidAR = slidAR;
window.simplAR = simplAR;

const BODY_TYPE_RADAR = "radar";
const BODY_TYPE_CUBE = "cube";
const BODY_TYPE_SLIDE_DEMO = "slideDemo";
const BODY_TYPE_SLIDE_DBAR = "dbar";
const BODY_TYPE_SLIDE_SLOW_SNAKES = "slsn";

const bodyType = query.firstParamSet([BODY_TYPE_SLIDE_DEMO, BODY_TYPE_CUBE, BODY_TYPE_RADAR, BODY_TYPE_SLIDE_DBAR, BODY_TYPE_SLIDE_SLOW_SNAKES]);
const paramValue = query.paramValue(bodyType);

switch (bodyType) {
    case BODY_TYPE_CUBE:
        appendStyles(['css/demo.css']);
        initCubes(paramValue);
        break;

    case BODY_TYPE_RADAR:
        appendStyles(['css/demo.css']);
        initRadars();
        break;

    case BODY_TYPE_SLIDE_DEMO:
        appendStyles(['css/slides.css']);
        initSlides("#container", demoSlides, paramValue);
        break;

    case BODY_TYPE_SLIDE_DBAR:
        slidarGlobal.slidesFolder = "slides/3dd3/html/";
        initSlides("#container", dbar.init, paramValue);
        break;

    default:
        slidarGlobal.slidesFolder = "slides/slowSnakes/html/";
        initSlides("#container", slowSnakes.init, paramValue);
}
