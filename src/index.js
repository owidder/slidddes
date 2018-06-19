import 'materialize-css/dist/css/materialize.css';

import './tween/tweenHelper';

import {initSlides} from './slides/slidesIndex';
import * as slowSnakes from "./slides/slowSnakes/slowSnakes";

import {slidAR} from './slides/slidAR/slidAR';
import {simplAR} from './simplAR/simplAR';
import {slidarGlobal} from './slides/slidAR/slidarGlobal';

window.slidAR = slidAR;
window.simplAR = simplAR;

slidarGlobal.slidesFolder = "slides/slowSnakes/html/";
initSlides("#container", slowSnakes.init);
