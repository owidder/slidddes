import * as _ from 'lodash';

import {Slides} from "../Slides";
import {staticSlide} from "../staticSlide";
import * as slidesUtil from '../slidesUtil';
import {slideControl} from '../control/SlideControl';

const width = window.innerWidth;
const height = window.innerHeight;

export const init = async (rootSelector, selectedFilename) => {

    const slides = new Slides(rootSelector, width, height);

    const createFct = (filename) => staticSlide(slides, filename);

    await Promise.all([
        slidesUtil.createSlide(createFct, "title", selectedFilename),
        slidesUtil.createSlide(createFct, "qrcode", selectedFilename),
        slidesUtil.createSlide(createFct, "css3d", selectedFilename),
        slidesUtil.createSlide(createFct, "cube", selectedFilename),
        slidesUtil.createSlide(createFct, "graph", selectedFilename),
        slidesUtil.createSlide(createFct, "backAndFront", selectedFilename),
        slidesUtil.createSlide(createFct, "argontitle", selectedFilename),
        slidesUtil.createSlide(createFct, "argon", selectedFilename),
        slidesUtil.createSlide(createFct, "threejstitle", selectedFilename),
        slidesUtil.createSlide(createFct, "positionRotation", selectedFilename),
        slidesUtil.createSlide(createFct, "simplartitle", selectedFilename),
        slidesUtil.createSlide(createFct, "pagejs", selectedFilename),
        slidesUtil.createSlide(createFct, "codejs", selectedFilename),
        slidesUtil.createSlide(createFct, "qrcode2", selectedFilename),
        slidesUtil.createSlide(createFct, "final", selectedFilename),
    ])

    if(_.isEmpty(selectedFilename)) {
        slideControl.setCurrentSlideId("title");
    }
    else {
        slideControl.setCurrentSlideId(selectedFilename);
    }

    return slides.selection();
}