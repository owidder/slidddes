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

const replaceSize = (name, size) => {
    return name.replace('<size>', size);
}

export const createSlides = async (rootSelector, selectedImgName, size = 'small') => {

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
    
    const templateImgNames = [
        'animals-<size>.jpg',
        'animals2-<size>.jpg',
        'animals3-<size>.jpg',
        'band-<size>.jpg',
        'becks-<size>.jpg',
        'bifi-<size>.jpg',
        'birds-<size>.jpg',
        'birds3-<size>.jpg',
        'blaetter-<size>.jpg',
        'boom-<size>.jpg',
        'brunnen-<size>.jpg',
        'brunnen2-<size>.jpg',
        'do-<size>.jpg',
        'engel-<size>.jpg',
        'fassade-<size>.jpg',
        'fassade2-<size>.jpg',
        'fratze-<size>.jpg',
        'gans-<size>.jpg',
        'gitter-<size>.png',
        'grancanaria-<size>.jpg',
        'hahn-<size>.jpg',
        'hase-<size>.jpg',
        'heineken-<size>.jpg',
        'hund-<size>.jpg',
        'ibiza-<size>.jpg',
        'jps-<size>.jpg',
        'koeln-<size>.jpg',
        'licht-<size>.jpg',
        'licht2-<size>.jpg',
        'nebensonnen-<size>.jpg',
        'pfaehle-<size>.jpg',
        'schiff-<size>.jpg',
        'stab-<size>.jpg',
        'stab2-<size>.jpg',
        'stab3-<size>.jpg',
        'staebe-<size>.jpg',
        'statue-<size>.jpg',
        'statue2-<size>.jpg',
        'statue3-<size>.jpg',
        'sunset-<size>.jpg',
        'sylt2-<size>.jpg',
        'sylt3-<size>.jpg',
        'sylt4-<size>.jpg',
        'viale-<size>.jpg',
        'voegel-<size>.jpg',
    ]

    const imgNames = templateImgNames.map(templateImgName => replaceSize(templateImgName, size));

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