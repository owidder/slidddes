import * as _ from 'lodash';

import {Slides} from "../Slides";
import {staticSlide} from "../staticSlide";
import * as slidesUtil from '../slidesUtil';
import {slideControl} from '../control/SlideControl';
import {slidarGlobal} from '../slidAR/slidarGlobal';

const width = slidarGlobal.width;
const height = slidarGlobal.height;

export const init = async (rootSelector, selectedFilename) => {

    const slides = new Slides(rootSelector, width, height);

    const createFct = (filename) => staticSlide(slides, filename);

    await Promise.all([
        slidesUtil.createSlide(createFct, "title-cube", selectedFilename),
        slidesUtil.createSlide(createFct, "title", selectedFilename),
        slidesUtil.createSlide(createFct, "qrcode", selectedFilename),
    ])

    if(_.isEmpty(selectedFilename)) {
        slideControl.setCurrentSlideId("title");
    }
    else {
        slideControl.setCurrentSlideId(selectedFilename);
    }

    return slides.selection();
}