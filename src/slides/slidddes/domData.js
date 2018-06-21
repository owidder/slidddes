import * as _ from 'lodash';

export const addDataToDomElement = (domElement, data) => {
    if(_.isEmpty(domElement._slidAR)) {
        domElement._slidAR = {...data};
    }
    else {
        domElement._slidAR = {...domElement._slidAR, ...data};
    }
}

export const getDomData = (domElement, data) => {
    if(!_.isObject(domElement._slidAR)) {
        domElement._slidAR = {};
    }
    return domElement._slidAR;
}

export const addAttributeToDomElement = (domElement, attributeName, value) => {
    addDataToDomElement(domElement, {[attributeName]: value});
}

export const getAttributeFromDomElement = (domElement, attributeName) => {
    return getDomData(domElement)[attributeName];
}
