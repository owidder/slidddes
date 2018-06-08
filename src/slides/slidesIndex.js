import * as _ from 'lodash';

import {log} from '../util/log';
import {setArPositionRotation, TYPE_RING, TYPE_SPHERE, TYPE_SPHERE_RANDOM, ringInit, sphereInit, randomSphereInit} from '../ar/arPositions';
import {init} from '../ar/argonApp';
import {initThree} from '../three/threeApp';
import {connect} from './control/commandHub';
import {executeCommand, COMMAND_INIT, COMMAND_NEXT, COMMAND_PREV} from './control/commandExecutor';
import {slideControl} from './control/SlideControl';
import * as key from './slidAR/key';
import * as query from '../util/query';
import * as slidAR from './slidAR/slidAR';
import {slidarGlobal} from './slidAR/slidarGlobal';
import * as steps from './slidAR/steps';
import * as hudUtil from "../ar/hudUtil";
import {set_THREE_argon, set_THREE_orig} from '../three/threeHelper';

window.slidAR = slidAR;

const TWEEN = window.TWEEN;
slideControl.setTWEEN(TWEEN);

slidarGlobal.width = window.innerWidth;
slidarGlobal.height = window.innerHeight;

const startSlideShow = (slideShowIntervalInSeconds) => {
    if(slideShowIntervalInSeconds > 0) {
        setInterval(() => {
            slideControl.nextSlide();
        }, slideShowIntervalInSeconds * 1000);
    }
}

const checkIfMaster = () => {
    const master = query.paramValue("master");
    slidarGlobal.isMaster = !_.isUndefined(master);
}

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

const initCamera = (targetIndex = 0) => {
    const camera = slidarGlobal.camera;
    const selection = slidarGlobal.selection;

    if(!_.isUndefined(camera)) {
        selection
            .filter((___, i) => {return i === targetIndex})
            .each(id => {
                const FACTOR = .9;
                const object = slideControl.getObject(id);
                camera.position.x = (object.position.x * FACTOR);
                camera.position.y = (object.position.y * FACTOR);
                camera.position.z = (object.position.z * FACTOR);

                if(!_.isUndefined(slidarGlobal.controls)) {
                    slidarGlobal.controls.target = object.position;
                }
            })
    }
}

const position3dSlides = async (rootSelector, slideCreateFunction, positionFunction, type, root) => {
    const selection = await slideCreateFunction(rootSelector);
    slidarGlobal.selection = selection;
    selection.each(function (id, i) {
        const object = setArPositionRotation(this, root, type, i, selection.size(), positionFunction);
        slideControl.addObject(id, object);
    });

    slideControl.initCamera(0);
}

export const initSlides = async (rootSelector, slideCreateFunction, param) => {
    key.init();
    connect();

    const selectedFilename = query.paramValue("slide");
    const nonar = query.paramValue("nonar");
    const type = query.paramValue("type") || TYPE_RING;
    const radius = query.paramValue("radius");
    const three = query.paramValue("three");
    checkIfMaster();

    const positionFunction = createPositionFunction(type, radius);

    if(_.isEmpty(selectedFilename) && _.isEmpty(nonar) && _.isEmpty(three)) {
        set_THREE_argon();
        slidarGlobal.withAr = true;
        slidarGlobal.useArgon = true;
        const slideShowIntervalInSeconds = param;
        const {root, app} = init();

        app.updateEvent.on(() => {
            TWEEN.update();
        });

        const selection = await slideCreateFunction(rootSelector);
        slidarGlobal.selection = selection;
        log.info("demo slides ready")
        selection.each(function (id, i) {
            const object = setArPositionRotation(this, root, type, i, selection.size(), positionFunction);
            slideControl.addObject(id, object);
        });

        startSlideShow(slideShowIntervalInSeconds);
        addHudButtons();
    }
    else if(!_.isEmpty(three)) {
        set_THREE_orig();
        slidarGlobal.withAr = true;
        slidarGlobal.useArgon = false;
        slidarGlobal.moveCameraNotSlides = true;
        const {scene, camera, renderer, controls} = initThree("#container");
        slidarGlobal.controls = controls;
        slidarGlobal.camera = camera;

        await position3dSlides(rootSelector, slideCreateFunction, positionFunction, type, scene);

        renderer.render(scene, camera);
        addHudButtons(
            () => {
                executeCommand(COMMAND_PREV)
            },
            () => {
                executeCommand(COMMAND_NEXT)
            });
    }
    else {
        set_THREE_argon();
        slidarGlobal.withAr = false;
        if(!_.isEmpty(selectedFilename)) {
            slideControl.setCurrentSlideId(selectedFilename);
            await slideCreateFunction(rootSelector, selectedFilename).then(() => steps.init());
        }
        addHudButtons();
    }

    executeCommand(COMMAND_INIT);
}
