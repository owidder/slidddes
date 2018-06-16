import * as _ from 'lodash';

import {Slides} from "../Slides";
import {staticSlide} from "../staticSlide";
import * as slidesUtil from '../slidesUtil';
import {slideControl} from '../control/SlideControl';
import {slidarGlobal} from '../slidAR/slidarGlobal';
import {initPhase} from '../slidAR/initPhase';


const width = slidarGlobal.width;
const height = slidarGlobal.height;

export const init = async (rootSelector, selectedFilename) => {

    const slides = new Slides(rootSelector, width, height);

    const createFct = (filename) => staticSlide(slides, filename);

    await Promise.all([
        slidesUtil.createSlide(createFct, "title-cube", selectedFilename),
        slidesUtil.createSlide(createFct, "the-snakes", selectedFilename),
        slidesUtil.createSlide(createFct, "the-contract", selectedFilename),
        slidesUtil.createSlide(createFct, "the-field", selectedFilename),
        slidesUtil.createSlide(createFct, "the-time", selectedFilename),
        slidesUtil.createSlide(createFct, "the-reward", selectedFilename),
        slidesUtil.createSlide(createFct, "tail-collision", selectedFilename),
    ])

    if(_.isEmpty(selectedFilename)) {
        slideControl.setCurrentSlideId("title-cube");
    }
    else {
        slideControl.setCurrentSlideId(selectedFilename);
    }

    const selection = slides.selection();
    await initPhase.waitForNumberOfSlides(selection.size());
    slideControl.runSlideEnterFunction();

    return selection;
}