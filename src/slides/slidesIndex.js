import * as _ from 'lodash';

import {setPositionRotation, TYPE_RING, TYPE_SPHERE, TYPE_SPHERE_RANDOM, ringInit, sphereInit, randomSphereInit} from '../ar/arPositions';
import {initThree} from '../three/threeApp';
import {executeCommand, COMMAND_INIT, COMMAND_NEXT, COMMAND_PREV} from './control/commandExecutor';
import {slideControl} from './control/SlideControl';
import * as key from './slidAR/key';
import * as query from '../util/query';
import * as slidAR from './slidAR/slidAR';
import {slidarGlobal} from './slidAR/slidarGlobal';
import * as hudUtil from "../ar/hudUtil";
import {set_THREE_orig} from '../three/threeHelper';

window.slidAR = slidAR;

const TWEEN = window.TWEEN;
slideControl.setTWEEN(TWEEN);

slidarGlobal.width = window.innerWidth;
slidarGlobal.height = window.innerHeight;

const addHudButtons = (_onLeftClick, _onRightClick) => {
    const onLeftClick = _.isFunction(_onLeftClick) ? _onLeftClick : () => slideControl.moveOffsetOnAllSlides(+10);
    const onRightClick = _.isFunction(_onRightClick) ? _onRightClick : () => slideControl.moveOffsetOnAllSlides(-10);

    hudUtil.addLeftRightButtons("#_hud", onLeftClick, onRightClick);
}

const createPositionFunction = (type, radius) => {
    switch (type) {
        case TYPE_RING:
            if(radius > 0) {
                return ringInit(Number(radius));
            }
            break;

        case TYPE_SPHERE:
            if(radius > 0) {
                return sphereInit(Number(radius));
            }
            break;

        case TYPE_SPHERE_RANDOM:
            if(radius > 0) {
                return randomSphereInit(50, Number(radius));
            }
            break;

        default:
            throw new Error("unkown type");
    }
}

const position3dSlides = async (rootSelector, slideCreateFunction, positionFunction, type, root) => {
    const selection = await slideCreateFunction(rootSelector);
    slidarGlobal.selection = selection;
    selection.each(function (id, i) {
        const object = setPositionRotation(this, root, type, i, selection.size(), positionFunction);
        slideControl.addObject(id, object);
    });

    slideControl.initCamera(0);
}

export const initSlides = async (rootSelector, slideCreateFunction) => {
    key.init();

    const type = query.paramValue("type") || TYPE_RING;
    const radius = query.paramValue("radius");
    const hud = query.paramValue("hud");

    const positionFunction = createPositionFunction(type, radius);

    set_THREE_orig();
    slidarGlobal.withAr = true;
    slidarGlobal.useArgon = false;
    slidarGlobal.moveCameraNotSlides = true;
    const {scene, camera, renderer, controls} = initThree("#container");
    slidarGlobal.controls = controls;
    slidarGlobal.camera = camera;

    await position3dSlides(rootSelector, slideCreateFunction, positionFunction, type, scene);

    renderer.render(scene, camera);

    if(hud > 0) {
        addHudButtons(
            () => {
                executeCommand(COMMAND_PREV)
            },
            () => {
                executeCommand(COMMAND_NEXT)
            });
    }

    executeCommand(COMMAND_INIT);
}
