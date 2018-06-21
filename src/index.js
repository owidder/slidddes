import 'materialize-css/dist/css/materialize.css';

import './tween/tweenHelper';

import {initSlides} from './slides/slidesIndex';
import * as slowSnakes from "./slides/slowSnakes/slowSnakes";

import {slidddes} from './slides/slidddes/slidddes';
import {slidarGlobal} from './slides/slidddes/slidarGlobal';

import './slidddes.css';

window.slidAR = slidddes;

slidarGlobal.slidesFolder = "slides/slowSnakes/html/";
initSlides("#container", slowSnakes.init);
