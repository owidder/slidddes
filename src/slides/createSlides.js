import * as _ from 'lodash';

import {Slides} from "./Slides";
import {imageSlide} from './imageSlide';
import * as slidesUtil from './slidesUtil';
import {slideControl} from './control/SlideControl';
import {slidddesGlobal} from './slidddes/slidddesGlobal';
import {Config} from './Config';

const width = slidddesGlobal.width;
const height = slidddesGlobal.height;

export const createSlides = async (rootSelector, selectedFilename) => {

    const slides = new Slides(rootSelector, width, height);

    const createFct = (imgName) => {
        slides.addOne(imgName);
        const config = new Config();
        config.pathToImage = "img/" + imgName;
        slideControl.registerConfig(imgName, config);

        return imageSlide.create(imgName, config);
    }
    
    const imgNames = [
        "band.jpg", 
        "becks.jpg", 
        "bifi.jpg", 
        "blaetter.jpg", 
        "boom.jpg", 
        "brunnen.jpg", 
        "brunnen2.jpg", 
        "do.jpg", 
        "engel.jpg", 
        "fassade.jpg", 
        "fassade2.jpg", 
        "fratze.jpg", 
        "gitter.png", 
        "heineken.jpg", 
        "jps.jpg", 
        "licht.jpg", 
        "licht2.jpg", 
        "pfaehle.jpg", 
        "stab.jpg", 
        "stab2.jpg", 
        "stab3.jpg", 
        "staebe.jpg", 
        "sunset.jpg", 
        "viale.jpg", 
    ]

    await Promise.all(imgNames.map(imgName => slidesUtil.createSlide(createFct, imgName, selectedFilename)));

    if(_.isEmpty(selectedFilename)) {
        slideControl.setCurrentSlideId(imgNames[0]);
    }
    else {
        slideControl.setCurrentSlideId(selectedFilename);
    }

    const selection = slides.selection();
    slideControl.runSlideEnterFunction();

    return selection;
}