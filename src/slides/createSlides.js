import * as _ from 'lodash';

import {Slides} from "./Slides";
import {imageSlide} from './imageSlide';
import {slideControl} from './control/SlideControl';
import {slidddesGlobal} from './slidddes/slidddesGlobal';
import {Config} from './Config';

const width = slidddesGlobal.width;
const height = slidddesGlobal.height;

const idFromString = (pathToImage) => {
    return pathToImage.replace(/\W/g, '');
}

export const createSlides = async (rootSelector, selectedImgName) => {

    const slides = new Slides(rootSelector, width, height);

    const create = (imgName) => {
        const id = idFromString(imgName);
        if(_.isUndefined(selectedImgName) || id == idFromString(selectedImgName)) {
            slides.addOne(id);
            const config = new Config();
            config.pathToImage = "img/" + imgName;
            slideControl.addSlideId(id);
            slideControl.registerConfig(id, config);

            return imageSlide.create(id, config);
        }
        else {
            return Promise.resolve();
        }
    }
    
    const imgNames = [
        "band-small.jpg",
        "becks-small.jpg",
        "bifi-small.jpg",
        "blaetter-small.jpg",
        "boom-small.jpg",
        "brunnen-small.jpg",
        "brunnen2-small.jpg",
        "do-small.jpg",
        "engel-small.jpg",
        "fassade-small.jpg",
        "fassade2-small.jpg",
        "fratze-small.jpg",
        "gitter-small.png",
        "heineken-small.jpg",
        "jps-small.jpg",
        "licht-small.jpg",
        "licht2-small.jpg",
        "pfaehle-small.jpg",
        "stab-small.jpg",
        "stab2-small.jpg",
        "stab3-small.jpg",
        "staebe-small.jpg",
        "sunset-small.jpg",
        "viale-small.jpg",
    ]

    await Promise.all(imgNames.map(imgName => create(imgName)));

    if(_.isEmpty(selectedImgName)) {
        slideControl.setCurrentSlideId(idFromString(imgNames[0]));
    }
    else {
        slideControl.setCurrentSlideId(idFromString(selectedImgName));
    }

    const selection = slides.selection();
    slideControl.runSlideEnterFunction();

    return selection;
}