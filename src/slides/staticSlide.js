import {HtmlSlide} from "./htmlSlide";
import {slidarGlobal} from './slidAR/slidarGlobal';

export const staticSlide = (slides, filename) => {
    const pathToHtml = slidarGlobal.slidesFolder + filename + ".html";
    const slideId = filename;
    slides.addOne(slideId);
    const slide = new HtmlSlide(slideId, {pathToHtml});
    return slide.getStartedPromise();
}
