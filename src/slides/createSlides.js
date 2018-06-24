import * as _ from 'lodash';

import {Slides} from "./Slides";
import {imageSlide} from './imageSlide';
import {slideControl} from './control/SlideControl';
import {slidddesGlobal} from './slidddes/slidddesGlobal';

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
            const config = {};
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
        'animals-small.jpg',
        'animals2-small.jpg',
        'animals3-small.jpg',
        'band-small.jpg',
        'becks-small.jpg',
        'bifi-small.jpg',
        'birds-small.jpg',
        'birds3-small.jpg',
        'blaetter-small.jpg',
        'boom-small.jpg',
        'brunnen-small.jpg',
        'brunnen2-small.jpg',
        'do-small.jpg',
        'engel-small.jpg',
        'fassade-small.jpg',
        'fassade2-small.jpg',
        'fratze-small.jpg',
        'gans-small.jpg',
        'gitter-small.png',
        'grancanaria-small.jpg',
        'hahn-small.jpg',
        'hase-small.jpg',
        'heineken-small.jpg',
        'ibiza-small.jpg',
        'jps-small.jpg',
        'koeln-small.jpg',
        'licht-small.jpg',
        'licht2-small.jpg',
        'nebensonnen-small.jpg',
        'pfaehle-small.jpg',
        'schiff-small.jpg',
        'stab-small.jpg',
        'stab2-small.jpg',
        'stab3-small.jpg',
        'staebe-small.jpg',
        'statue-small.jpg',
        'statue2-small.jpg',
        'statue3-small.jpg',
        'sunset-small.jpg',
        'sylt2-small.jpg',
        'sylt3-small.jpg',
        'sylt4-small.jpg',
        'viale-small.jpg',
        'voegel-small.jpg',
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