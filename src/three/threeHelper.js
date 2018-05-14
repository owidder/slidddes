import {slidarGlobal} from '../slides/slidAR/slidarGlobal';

import * as THREE_orig from 'three'

window.THREE_orig = THREE_orig // Not saying it's pretty

const THREE_argon = window.THREE;
window.THREE_argon = THREE_argon;

const set_THREE_argon = () => {
    window.THREE = THREE_argon;
    slidarGlobal.THREE = THREE_argon;
}

const set_THREE_orig = () => {
    require('three/examples/js/controls/TrackballControls.js') // eslint-disable-line
    require('three/examples/js/renderers/CSS3DRenderer.js') // eslint-disable-line

    window.THREE = THREE_orig;
    slidarGlobal.THREE = THREE_orig;
}

export {
    THREE_argon, THREE_orig,
    set_THREE_argon, set_THREE_orig
}
