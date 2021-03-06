import * as _ from 'lodash';
import * as $ from 'jquery';
import * as d3 from 'd3';

import {multiplyPosition} from '../../util/mathUtil';
import {log} from '../../util/log';
import * as fct from '../../util/fct';
import {slidddesGlobal} from '../slidddes/slidddesGlobal';
import * as nonArSlides from '../nonArSlides';

import * as transform from '../../three/transform';

export const PAUSE_FUNCTION = 'pauseFunction';
export const RESUME_FUNCTION = 'resumeFunction';
export const SLIDE_ENTER_FUNCTION = 'slideEnterFunction';
export const SLIDE_EXIT_FUNCTION = 'slideExitFunction';

/* eslint eqeqeq: "off" */
class SlideControl {

    constructor() {
        this.configs = {};
        this.steps = {};
        this.slideIds = [];
    }

    setTWEEN(TWEEN) {
        this.TWEEN = TWEEN;
        slidddesGlobal.TWEEN = TWEEN;
    }

    getNumberOfSlides() {
        return this.slideIds.length;
    }

    getSlideIds() {
        return this.slideIds;
    }

    _waitForAllSteps = (resolve) => {
        if(this.getNumberOfSteps() < this.getNumberOfSlides()) {
            setTimeout(() => this._waitForAllSteps(resolve), 100);
        }
        else {
            setTimeout(() => resolve(), 100);
        }
    }

    waitForAllSteps() {
        return new Promise((resolve) => {
            this._waitForAllSteps(resolve);
        })
    }

    registerConfig(slideId, config) {
        log.info("registered: " + slideId);
        log.info(config);
        this.configs[slideId] = config;
    }

    getConfig(slideId) {
        return this.configs[slideId];
    }

    createAndRegisterConfig(slideId) {
        log.info("created new config for: " + slideId);
        const config = {};
        this.registerConfig(slideId, config);

        return config;
    }

    addObject(slideId, object) {
        log.info("add object to slideId: " + slideId);
        log.info(object);
        const config = this.configs[slideId];
        if(_.isObject(config)) {
            config.object = object;
        }
    }

    getObject(slideId) {
        const config = this.configs[slideId];
        if(_.isObject(config)) {
            return config.object;
        }
    }

    getAllObjects() {
        const allObjects = _.map(this.configs, 'object');
        return allObjects;
    }

    doForAll(fctName) {
        _.forOwn(this.configs, (config) => {
            SlideControl.doForOneWithConfig(config, fctName);
        })
    }

    doForOneWithSlideId(slideId, fctName) {
        const config = this.configs[slideId];
        SlideControl.doForOneWithConfig(config, fctName);
    }

    static doForOneWithConfig(config, fctName) {
        if(!_.isEmpty(config)) {
            const configFct = config[fctName];
            if(fct.isFunction(configFct)) {
                configFct();
            }
        }
    }

    doForOneOrForAll(param, fctName) {
        if(param === ":all") {
            this.doForAll(fctName);
        }
        else {
            this.doForOneWithSlideId(param, fctName);
        }
    }

    pauseJs(param) {
        this.doForOneOrForAll(param, PAUSE_FUNCTION);
    }

    resumeJs(param) {
        this.doForOneOrForAll(param, RESUME_FUNCTION);
    }

    nextSlide() {
        if(slidddesGlobal.with3d) {
            const allObjects = this.getAllObjects();
            transform.allNext(allObjects, this.TWEEN);
            this.shiftForwardCurrentSlideId();
        }
        else {
            this.shiftForwardCurrentSlideId();
            nonArSlides.nextSlide(this.currentSlideId);
        }
    }

    gotoSlide(slideId) {
        if(slideId != this.currentSlideId) {
            this.setCurrentSlideId(slideId);
            if(slidddesGlobal.with3d) {
                this.initCamera(this.indexOfCurrentSlide());
            }
            else {
                nonArSlides.nextSlide(slideId);
            }
        }
    }

    moveCameraTo(newCameraPosition, duration) {
        return new Promise((resolve) => {
            new this.TWEEN.Tween(slidddesGlobal.camera.position)
                .to({x: newCameraPosition.x, y: newCameraPosition.y, z: newCameraPosition.z}, (1 + Math.random()) * duration)
                .easing(this.TWEEN.Easing.Linear.None)
                .onComplete(() => {
                    resolve();
                })
                .start();
        });
    }

    moveCameraAway(duration) {
        const factor = 1.2;
        const currentSlideId = this.getCurrentSlideId();
        const currentObject = this.getObject(currentSlideId);
        const newCameraPosition = this.cameraPositionForObject(currentObject, factor);
        const newControlTarget = multiplyPosition(currentObject.position, -1.0);

        return Promise.all([
            this.moveCameraTo(newCameraPosition, duration),
            this.moveControlTargetTo(newControlTarget, duration)
        ])
    }

    async moveCameraFwdBack(trueIfFwd, sendStatusFunction) {
        const self = this;
        this.runSlideExitFunction();

        //await this.moveCameraAway(3000);

        if(trueIfFwd) {
            this.shiftForwardCurrentSlideId();
        }
        else {
            this.shiftBackwardCurrentSlideId();
        }

        const currentSlideId = this.getCurrentSlideId();
        const currentObject = this.getObject(currentSlideId);
        const newCameraPosition = this.cameraPositionForObject(currentObject);

        await Promise.all([this.moveCameraToCurrentSlide(10000), this.moveCameraTo(newCameraPosition, 10000)]);
        fct.call(sendStatusFunction);
        self.runSlideEnterFunction();
    }

    moveSlides(trueIfFwd, sendStatusFunction) {
        return new Promise((resolve) => {
            const allObjects = this.getAllObjects();
            transform.allFwdBack(allObjects, this.TWEEN, trueIfFwd).then(() => {
                if(trueIfFwd) {
                    this.shiftForwardCurrentSlideId();
                }
                else {
                    this.shiftBackwardCurrentSlideId();
                }
                fct.call(sendStatusFunction);
                this.moveCameraToCurrentSlide(1000).then(() => {
                    resolve();
                })
            })
        })
    }

    fwdSlideForever() {
        this.fwdSlide().then(() => {
            this.fwdSlideForever();
        })
    }

    fwdSlide(sendStatusFunction) {
        return new Promise((resolve) => {
            if(slidddesGlobal.with3d) {
                if(slidddesGlobal.moveCameraNotSlides) {
                    this.moveCameraFwdBack(true, sendStatusFunction).then(() => {
                        resolve();
                    })
                }
                else {
                    this.moveSlides(true, sendStatusFunction).then(() => {
                        resolve();
                    })
                }
            }
            else {
                this.shiftForwardCurrentSlideId();
                fct.callWithPromise(sendStatusFunction).then(() => {
                    nonArSlides.nextSlide(this.currentSlideId);
                    resolve();
                });
            }
        })
    }

    backSlide(sendStatusFunction) {
        if(slidddesGlobal.with3d) {
            if(slidddesGlobal.moveCameraNotSlides) {
                this.moveCameraFwdBack(false, sendStatusFunction)
            }
            else {
                this.moveSlides(false, sendStatusFunction);
            }
        }
        else {
            this.shiftBackwardCurrentSlideId();
            fct.callWithPromise(sendStatusFunction).then(() => {
                nonArSlides.nextSlide(this.currentSlideId);
            })
        }
    }

    moveOffsetOnAllSlides(offset) {
        const allObjects = this.getAllObjects();
        transform.allMoveOffset(allObjects, this.TWEEN, offset);
    }

    moveToAbsolutePosition(slideId, position) {
        const object = this.getObject(slideId);
        if(_.isObject(object)) {
            transform.moveTo(object, position, object.rotation, this.TWEEN);
        }
    }

    moveToAbsoluteRotation(slideId, rotation) {
        const object = this.getObject(slideId);
        if(_.isObject(object)) {
            transform.moveTo(object, object.position, rotation, this.TWEEN);
        }
    }

    cameraPositionForObject(object, factor = .95) {
        return multiplyPosition(object.position, factor);
    }

    initCamera(targetIndex = 0) {
        const camera = slidddesGlobal.camera;
        const selection = slidddesGlobal.selection;

        if(!_.isUndefined(camera)) {
            selection
                .filter((___, i) => {return i === targetIndex})
                .each(id => {
                    const object = slideControl.getObject(id);
                    const cameraPosition = this.cameraPositionForObject(object);
                    camera.position.x = cameraPosition.x;
                    camera.position.y = cameraPosition.y;
                    camera.position.z = cameraPosition.z;

                    if(!_.isUndefined(slidddesGlobal.controls)) {
                        slidddesGlobal.controls.target = object.position;
                    }
                })
        }
    }

    moveCameraToCurrentSlide(duration) {
        const currentSlideId = this.getCurrentSlideId();
        const currentObject = this.getObject(currentSlideId);

        return this.moveControlTargetTo({
            x: currentObject.position.x,
            y: currentObject.position.y,
            z: currentObject.position.z
        }, duration);
    }

    moveControlTargetTo(newControlTargetPosition, duration) {
        return new Promise((resolve) => {
            const startPosition = {...slidddesGlobal.controls.target};
            new this.TWEEN.Tween(startPosition)
                .to({x: newControlTargetPosition.x, y: newControlTargetPosition.y, z: newControlTargetPosition.z}, (1 + Math.random()) * duration)
                .onUpdate((currentPosition) => {
                    slidddesGlobal.controls.target = startPosition;
                })
                .easing(this.TWEEN.Easing.Linear.None)
                .onComplete(() => {
                    resolve();
                })
                .start();
        })
    }

    moveToAbsolutePositionRotation(slideId, position, rotation) {
        const object = this.getObject(slideId);
        if(_.isObject(object)) {
            transform.moveTo(object, position, rotation, this.TWEEN);
        }
    }

    unactive() {
        d3.selectAll("#" + this.currentSlideId)
            .classed("activeslide", false)
    }

    active() {
        d3.selectAll("#" + this.currentSlideId)
            .classed("activeslide", true)
    }

    setCurrentSlideId(slideId) {
        this.unactive();
        this.currentSlideId = slideId;
        this.active();
    }

    addSlideId(slideId) {
        this.slideIds.push(slideId);
        this.steps[slideId] = {stepNumber: 0};
    }

    indexOfCurrentSlide() {
        return this.slideIds.indexOf(this.currentSlideId);
    }

    indexOfNextSlideForward() {
        const currentIndex = this.indexOfCurrentSlide();
        return currentIndex >= this.slideIds.length - 1 ? 0 : currentIndex+1;
    }

    runScriptOnCurrentSlide(scriptName, duration) {
        const config = this.getCurrentConfig();
        const script = config[scriptName];
        if(_.isFunction(script)) {
            if(duration > 0) {
                setTimeout(script, duration)
            }
            else {
                script();
            }
        }
    }

    pauseCurrentSlide() {
        this.runScriptOnCurrentSlide(PAUSE_FUNCTION, 1000);
    }

    getCurrentConfig() {
        const currentSlideId = this.getCurrentSlideId();
        return this.getConfig(currentSlideId);
    }

    runSlideExitFunction() {
        const config = this.getCurrentConfig();
        if(config.lastRunEnterOrExitFunction == SLIDE_ENTER_FUNCTION) {
            this.runScriptOnCurrentSlide(SLIDE_EXIT_FUNCTION, 0);
            config.lastRunEnterOrExitFunction = SLIDE_EXIT_FUNCTION;
        }
    }

    runSlideEnterFunction() {
        const config = this.getCurrentConfig();
        if(_.isUndefined(config.lastRunEnterOrExitFunction) || config.lastRunEnterOrExitFunction == SLIDE_EXIT_FUNCTION) {
            this.runScriptOnCurrentSlide(SLIDE_ENTER_FUNCTION, 0);
            config.lastRunEnterOrExitFunction = SLIDE_ENTER_FUNCTION;
        }
    }

    resumeCurrentSlide() {
        this.runScriptOnCurrentSlide(RESUME_FUNCTION);
    }

    shiftForwardCurrentSlideId() {
        const nextIndex = this.indexOfNextSlideForward();
        this.setCurrentSlideId(this.slideIds[nextIndex]);
    }

    indexOfNextSlideBack() {
        const currentIndex = this.indexOfCurrentSlide();
        return currentIndex <= 0 ? this.slideIds.length - 1 : currentIndex-1;
    }

    shiftBackwardCurrentSlideId() {
        const nextIndex = this.indexOfNextSlideBack();
        this.setCurrentSlideId(this.slideIds[nextIndex]);
    }

    setStepsObject(slideId, steps, stepNumber = 0) {
        this.steps[slideId] = {steps, stepNumber};
    }

    getStepsObject = (slideId) => {
        return this.steps[slideId];
    }

    getNumberOfSteps() {
        return this.steps.length;
    }

    setCurrentStepsObject(steps, stepNumber = 0) {
        this.setStepsObject(this.currentSlideId, steps, stepNumber);
    }

    getCurrentStepsObject() {
        return this.getStepsObject(this.currentSlideId);
    }

    getCurrentSlideId() {
        return this.currentSlideId;
    }

    renderStepNumberForSlideId(slideId) {
        const renderCounterElement = $("#" + slideId + " .slidecounter");
        if(!_.isEmpty(renderCounterElement)) {
            const {steps, stepNumber} = this.getStepsObject(slideId);
            renderCounterElement.html(stepNumber + " / " + steps.length);
        }
    }

    renderStepNumber() {
        this.renderStepNumberForSlideId(this.currentSlideId);
    }

    incStepNumber(slideId) {
        const {steps, stepNumber} = this.getStepsObject(slideId);
        const newStepNumber = stepNumber+1;
        this.setStepsObject(slideId, steps, newStepNumber);
        this.renderStepNumberForSlideId(slideId);

        return newStepNumber;
    }

    incCurrentStepNumber() {
        return this.incStepNumber(this.currentSlideId);
    }

    decStepNumber(slideId) {
        const {steps, stepNumber} = this.getStepsObject(slideId);
        const newStepNumber = stepNumber-1;
        this.setStepsObject(slideId, steps, newStepNumber);
        this.renderStepNumberForSlideId(slideId);

        return newStepNumber;
    }

    decCurrentStepNumber() {
        return this.decStepNumber(this.currentSlideId);
    }

    _gotoStep(slideId, toStepNumber, resolve) {
        const fromStepNumber = this.getStepsObject(slideId).stepNumber;
        if(fromStepNumber == toStepNumber) {
            resolve();
        }
        else {
            if(toStepNumber > fromStepNumber) {
                for(let i = 0; i < toStepNumber - fromStepNumber; i++) {
                    this.forwardStepOnSlideId(slideId);
                }
            }
            else {
                for(let i = 0; i < fromStepNumber - toStepNumber; i++) {
                    this.backwardStepOnSlideId(slideId);
                }
            }
        }
    }

    async gotoStep(slideId, toStepNumber) {
        await this.waitForAllSteps();
        return new Promise((resolve) => {
            this._gotoStep(slideId, toStepNumber, resolve);
        })
    }

    gotoStepOnCurrentSlide(toStepNumber) {
        return this.gotoStep(this.currentSlideId, toStepNumber);
    }

    forwardStepOnSlideId(slideId) {
        const {steps, stepNumber} = this.getStepsObject(slideId);
        if(_.isEmpty(steps)) {
            return
        }
        if(stepNumber < steps.length) {
            const step = steps[stepNumber];
            fct.call(step.f);
            this.incStepNumber(slideId);
        }
    }

    forwardStep() {
        this.forwardStepOnSlideId(this.currentSlideId);
    }

    _stepFwd(numberOfSteps) {
        if(numberOfSteps > 0) {
            this.forwardStep();
            setTimeout(() => this._stepFwd(numberOfSteps-1), 10);
        }
    }

    _stepBack(numberOfSteps) {
        if(numberOfSteps > 0) {
            this.backwardStep();
            setTimeout(() => this._stepBack(numberOfSteps-1), 10);
        }
    }

    async gotoLastStep() {
        await this.waitForAllSteps();
        const {steps} = this.getCurrentStepsObject();
        if(_.isEmpty(steps)) {
            return
        }
        return this.gotoStepOnCurrentSlide(steps.length-1);
    }

    gotoFirstStep() {
        return this.gotoStepOnCurrentSlide(0);
    }

    backwardStepOnSlideId(slideId) {
        const {steps, stepNumber} = this.getStepsObject(slideId);
        if(_.isEmpty(steps) || !(stepNumber > 0)) {
            return
        }
        const newstepNumber = this.decStepNumber(slideId);
        const step = steps[newstepNumber];
        fct.call(step.b);
    }

    backwardStep() {
        const {steps, stepNumber} = this.getCurrentStepsObject();
        if(_.isEmpty(steps) || !(stepNumber > 0)) {
            return
        }
        const newstepNumber = this.decCurrentStepNumber();
        const step = steps[newstepNumber];
        fct.call(step.b);
    }

}

export const slideControl = new SlideControl();
