import 'materialize-css/dist/css/materialize.css';

import './tween/tweenHelper';

import {initSlides} from './slides/slidesIndex';
import * as slowSnakes from "./slides/slowSnakes/slowSnakes";

import {slidAR} from './slides/slidAR/slidAR';
import {slidarGlobal} from './slides/slidAR/slidarGlobal';

import './slidddes.css';

window.slidAR = slidAR;

slidarGlobal.slidesFolder = "slides/slowSnakes/html/";
initSlides("#container", slowSnakes.init);
