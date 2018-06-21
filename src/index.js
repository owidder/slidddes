import 'materialize-css/dist/css/materialize.css';

import './tween/tweenHelper';

import {initSlides} from './slides/slidesIndex';
import * as slowSnakes from "./slides/slowSnakes/slowSnakes";

import {slidddes} from './slides/slidddes/slidddes';
import {slidddesGlobal} from './slides/slidddes/slidddesGlobal';

import './slidddes.css';

window.slidddes = slidddes;

slidddesGlobal.slidesFolder = "slides/slowSnakes/html/";
initSlides("#container", slowSnakes.init);
