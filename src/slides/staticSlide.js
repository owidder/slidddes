import {HtmlSlide} from "./htmlSlide";
import {slidddesGlobal} from './slidddes/slidddesGlobal';

export const staticSlide = (slides, filename) => {
    const pathToHtml = slidddesGlobal.slidesFolder + filename + ".html";
    const slideId = filename;

    const slide = new HtmlSlide(slideId, {pathToHtml});
    return slide.getStartedPromise();
}
