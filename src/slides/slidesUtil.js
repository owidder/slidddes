import * as _ from "lodash";
import {slideControl} from "./control/SlideControl";

export const createSlide = (createFct, filename, selectedFilename) => {
    slideControl.addSlideId(filename);

    if(_.isEmpty(selectedFilename) || filename === selectedFilename) {
        return createFct(filename);
    }
    else {
        return Promise.resolve();
    }
}

