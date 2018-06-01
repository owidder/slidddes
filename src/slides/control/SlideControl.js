import * as _ from 'lodash';
import * as $ from 'jquery';
import * as d3 from 'd3';

import {log} from '../../util/log';
import * as fct from '../../util/fct';
import {slidarGlobal} from '../slidAR/slidarGlobal';
import * as nonArSlides from '../nonArSlides';

import * as arTransform from '../../ar/arTransform';

/* eslint eqeqeq: "off" */
class SlideControl {

    constructor(withAr) {
        this.configs = {};
        this.steps = {};
        this.slideIds = [];
    }

    setTWEEN(TWEEN) {
        this.TWEEN = TWEEN;
        slidarGlobal.TWEEN = TWEEN;
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
        this.doForOneOrForAll(param, "pauseFunction");
    }

    resumeJs(param) {
        this.doForOneOrForAll(param, "resumeFunction");
    }

    nextSlide() {
        if(slidarGlobal.withAr) {
            const allObjects = this.getAllObjects();
            arTransform.allNext(allObjects, this.TWEEN);
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
            if(slidarGlobal.withAr) {
                this.initCamera(this.indexOfCurrentSlide());
            }
            else {
                nonArSlides.nextSlide(slideId);
            }
        }
    }

    moveCameraFwdBack(trueIfFwd, sendStatusFunction) {
        if(trueIfFwd) {
            this.shiftForwardCurrentSlideId();
        }
        else {
            this.shiftBackwardCurrentSlideId();
        }

        const currentSlideId = this.getCurrentSlideId();
        const currentObject = this.getObject(currentSlideId);
        const newCameraPosition = this.cameraPositionForObject(currentObject);
        this.moveCameraToCurrentSlide();
        new this.TWEEN.Tween(slidarGlobal.camera.position)
            .to({x: newCameraPosition.x, y: newCameraPosition.y, z: newCameraPosition.z}, (1 + Math.random()) * 2000)
            .easing(this.TWEEN.Easing.Exponential.InOut)
            .onComplete(() => {
                fct.call(sendStatusFunction);
            })
            .start();
    }

    moveSlides(trueIfFwd, sendStatusFunction) {
        const allObjects = this.getAllObjects();
        arTransform.allFwdBack(allObjects, this.TWEEN, trueIfFwd).then(() => {
            if(trueIfFwd) {
                this.shiftForwardCurrentSlideId();
            }
            else {
                this.shiftBackwardCurrentSlideId();
            }
            fct.call(sendStatusFunction);
            this.moveCameraToCurrentSlide();
        })
    }

    fwdSlide(sendStatusFunction) {
        if(slidarGlobal.withAr) {
            if(slidarGlobal.moveCameraNotSlides) {
                this.moveCameraFwdBack(true, sendStatusFunction)
            }
            else {
                this.moveSlides(true, sendStatusFunction);
            }
        }
        else {
            this.shiftForwardCurrentSlideId();
            fct.callWithPromise(sendStatusFunction).then(() => {
                nonArSlides.nextSlide(this.currentSlideId);
            });
        }
    }

    moveOffsetOnAllSlides(offset) {
        const allObjects = this.getAllObjects();
        arTransform.allMoveOffset(allObjects, this.TWEEN, offset);
    }

    moveToAbsolutePosition(slideId, position) {
        const object = this.getObject(slideId);
        if(_.isObject(object)) {
            arTransform.moveTo(object, position, object.rotation, this.TWEEN);
        }
    }

    moveToAbsoluteRotation(slideId, rotation) {
        const object = this.getObject(slideId);
        if(_.isObject(object)) {
            arTransform.moveTo(object, object.position, rotation, this.TWEEN);
        }
    }

    cameraPositionForObject(object) {
        const FACTOR = .92;
        return {
            x: object.position.x * FACTOR,
            y: object.position.y * FACTOR,
            z: object.position.z * FACTOR
        };
    }

    initCamera(targetIndex = 0) {
        const camera = slidarGlobal.camera;
        const selection = slidarGlobal.selection;

        if(!_.isUndefined(camera)) {
            selection
                .filter((___, i) => {return i === targetIndex})
                .each(id => {
                    const object = slideControl.getObject(id);
                    const cameraPosition = this.cameraPositionForObject(object);
                    camera.position.x = cameraPosition.x;
                    camera.position.y = cameraPosition.y;
                    camera.position.z = cameraPosition.z;

                    if(!_.isUndefined(slidarGlobal.controls)) {
                        slidarGlobal.controls.target = object.position;
                    }
                })
        }
    }

    moveCameraToCurrentSlide() {
        if(!_.isUndefined(slidarGlobal.controls)) {
            const currentSlideId = this.getCurrentSlideId();
            const currentObject = this.getObject(currentSlideId);

            if(this.TWEEN) {
                const startPosition = {...slidarGlobal.controls.target};
                new this.TWEEN.Tween(startPosition)
                    .to({x: currentObject.position.x, y: currentObject.position.y, z: currentObject.position.z}, (1 + Math.random()) * 1000)
                    .onUpdate((currentPosition) => {
                        console.log(startPosition);
                        slidarGlobal.controls.target = startPosition;
                    })
                    .easing(this.TWEEN.Easing.Exponential.InOut)
                    .start();
            }
            else {
                slidarGlobal.controls.target = currentObject.position;
            }
        }
    }

    moveToAbsolutePositionRotation(slideId, position, rotation) {
        const object = this.getObject(slideId);
        if(_.isObject(object)) {
            arTransform.moveTo(object, position, rotation, this.TWEEN);
        }
    }

    backSlide(sendStatusFunction) {
        if(slidarGlobal.withAr) {
            this.moveSlides(false, sendStatusFunction);
        }
        else {
            this.shiftBackwardCurrentSlideId();
            fct.callWithPromise(sendStatusFunction).then(() => {
                nonArSlides.nextSlide(this.currentSlideId);
            })
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
        const currentSlideId = this.getCurrentSlideId();
        const config = this.getConfig(currentSlideId);
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
        this.runScriptOnCurrentSlide('pauseFunction', 1000);
    }

    resumeCurrentSlide() {
        this.runScriptOnCurrentSlide('resumeFunction');
    }

    shiftForwardCurrentSlideId() {
        this.pauseCurrentSlide();
        const nextIndex = this.indexOfNextSlideForward();
        this.setCurrentSlideId(this.slideIds[nextIndex]);
        this.resumeCurrentSlide();
    }

    indexOfNextSlideBack() {
        const currentIndex = this.indexOfCurrentSlide();
        return currentIndex <= 0 ? this.slideIds.length - 1 : currentIndex-1;
    }

    shiftBackwardCurrentSlideId() {
        this.pauseCurrentSlide();
        const nextIndex = this.indexOfNextSlideBack();
        this.setCurrentSlideId(this.slideIds[nextIndex]);
        this.resumeCurrentSlide();
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
