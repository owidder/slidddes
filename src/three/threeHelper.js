import {slidarGlobal} from '../slides/slidddes/slidarGlobal';

import * as THREE_orig from 'three'

window.THREE_orig = THREE_orig // Not saying it's pretty

const THREE_argon = window.THREE;
window.THREE_argon = THREE_argon;

const set_THREE_orig = () => {
    window.THREE = THREE_orig;

    require('three/examples/js/controls/TrackballControls.js') // eslint-disable-line
    require('three/examples/js/renderers/CSS3DRenderer.js') // eslint-disable-line

    slidarGlobal.THREE = window.THREE;
}

export {
    THREE_argon, THREE_orig,
    set_THREE_orig
}
